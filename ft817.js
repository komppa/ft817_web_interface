const SerialPort = require('serialport')
const ByteLength = require('@serialport/parser-byte-length')
const { ranByJest } = require('./ranByJest')
const modes = require('./modes')
const frequencies = require('./frequencies')
const { hexToBin, hexToDec } = require('./conversions')


/** Class representing a connection between you and the radio */
class FT817 {

    /**
     * Create new connection between radio and the computer.
     * @param {string} serial_port - serial port that wil be used for communication. Pass 0 if do not want to establish a real connection.
     * @param {number} [serial_speed=9600] - serial port's communication speed
     */
    constructor(serial_port, serial_speed = 9600) {

        this.serial_port = serial_port      // Speed for serial connection
        this.serial_speed = serial_speed    // Serial port that will be used for communication
        this.executable_command             // Command that will be executed
        this.response                       // Response from the radio
        this.wpo                            // Write protection object

        // Check if serial port to be used was defined
        if (!this.serial_port && !ranByJest()) {
            throw new Error("Serial port was not defined")
        }

        // If not ran by Jest testing framework, establish connection to the serial port
        if(!ranByJest() && this.serial_port != 0) {

            this.port = new SerialPort(this.serial_port, {
                baudRate: this.serial_speed
            })

            this.port.on('error', function(err) {
                throw new Error("Serial device does not exist")
            })
            
            // On default, we will assume that response will be one byte long.
            this.parser = this.port.pipe(new ByteLength({length: 1}))

        }
        
    }

    /**
     * Changes response's assumed response length by removing 
     * previously assigned ByteLength and creating a new one.
     * @param {number} byte_length - assumed response length
     */
    setResponseLength(byte_length) {
        this.response_length = byte_length
        this.parser = this.port.unpipe()
        this.parser = this.port.pipe(new ByteLength({length: this.response_length}))
    }

    /**
     * EEPROM write protection. Prevents fast and infinite
     * write operations to the radio, since write operations wear out the memory. 
     * Allows 6 fastly made write operations to be executed consecutively.
     * @return {boolean} - Status of whether or not the write operation is allowed.                 
     */
    eepromWriteProtection() {
        // Check if write protection object has been defined
        if (typeof this.wpo === "undefined") {

            // Initialize wpo, set writes count to one, mark currest timestamp
            this.wpo = {
                writes: 1,
                lastWriteTs: Math.floor(new Date())
            }
            return true
        }

        // When wpo exists, check if last write was made <2 seconds ago.
        // If yes, increase counter by one to indicate
        // that a fast execution has been made. If counter 
        // is at its maximum value (6), return rejective status.
        
        if (this.wpo.lastWriteTs < (Math.floor(new Date())) - 2000 ) {
            // Last write operation executed >2 seconds ago
            // Update timestamp for last write operation, reset counter and allow write operation
            this.wpo.lastWriteTs = Math.floor(new Date())
            this.wpo.writes = 0
            return true
        } else {
            // Last write operation executed <2 seconds ago
            // Check if this is the 7th write operation within 2 seconds from the previous one.
            if (this.wpo.writes === 6) {
                // Update timestamp and disallow write operation
                this.wpo.lastWriteTs = Math.floor(new Date())
                return false
            } else {
                // 2nd-6th oepration, increase writes, update timestamp and allow operation
                this.wpo.writes = this.wpo.writes + 1
                this.wpo.lastWriteTs = Math.floor(new Date())
                return true
            }
        }
    }
    
    /**
     * Executes commands and returns response from the radio. If no argument passed, 
     * it assumes that operation is write operation and thus those are limited in specific time window.
     * @param {boolean} [isWriteOperation=true] - Pass flag false if executable command is not write operation to radio's EEPROM.
     * @return {Promise} Promise object represents the response from the radio
     */
    async executeCommand (isWriteOperation = true) {

        if (isWriteOperation) {
            // Check if write operation is legal
            if (!this.eepromWriteProtection()) {
                throw new Error("Too many EEPROM write operaions in short time window")
            }
        }

        return new Promise((resolve, reject) => {

            // Timeout in a half of a second
            let commandTimeouter = setTimeout(() => {
                reject(new Error("Radio did not respond within set timeout"))
            }, 500)
            
            this.port.write(this.getCommand())
            
            /*
                Add event listener, if assumed response length is not zero, (once) that waits incoming data
                that its length will be is the same as ByteLength's length.
            */
            if (this.response_length !== 0) {
                this.parser.once('data', received_data => {
                    clearInterval(commandTimeouter)
                    resolve(received_data.toString('hex'))
                })
            }
        })
    }

    /**
     * Set executable command to the object's variable executable_command and
     * converts values to hex
     */
    setCommand(command) {
        this.executable_command = Buffer.from(command)
    }

    /**
     * Get previously set executable command
     */
    getCommand() {
        return this.executable_command
    }

    /**
     * Sets given command to the executable command, sets
     * given response length as assumed response length and 
     * after those, executes command, waits for the response and
     * returns it.
     * @param {number[]} command - executable command 
     * @param {number} [response_length=1] - expected response length
     * @return {Promise} Promise object represents the response from the radio
     */
    async execute(command, response_length = 1, isWriteOperation = true) {
        this.setCommand(command)
        this.setResponseLength(response_length)
        // Do not execute command if Jest is runnning this session
        if (!ranByJest()) {
            this.response = await this.executeCommand(isWriteOperation)
        }
    }

    /**
     * Set frequency to the radio.
     * Accepts frequencies as both, numbers and string. Method will
     * add leading zeros if needed and then validates given frequency 
     * against frequencies lib. 
     * @param {number | string} frequency - frequency to set to the radio 
     * @return {Promise} Promise object represents the frequency that was set to the radio 
     */
    async setFrequency(frequency = '14575000') {

        return new Promise(async (resolve, reject) => {

            // Make frequency into a number if not already because the range is checked next
            if(isNaN(frequency)) {
                frequency = parseInt(frequency)
            }

            // Check if frequency is valid atleast for RX
            if (!frequencies.isValidRxFrequency(frequency)) {
                reject(new Error("Invalid frequency for RX"))
            }
            
            // Convert back to string
            frequency = frequency.toString()

            // Add leading zeros for so long that it is eight chars long
            frequency = frequency.padStart(8, '0')

            let f = frequency

            await this.execute([
                '0x' + f.charAt(0) + f.charAt(1),
                '0x' + f.charAt(2) + f.charAt(3),
                '0x' + f.charAt(4) + f.charAt(5),
                '0x' + f.charAt(6) + f.charAt(7),
                0x01 
            ])

            resolve(f)

        })

    }

    /**
     * Set operation mode to the radio.
     * Accepts both a string (like 'USB') or a number (1 for USB) as an argument. 
     * Method validates requested mode and returns true if mode was succesfully set. 
     * @param {string | number} mode - Mode to be selected as current operating mode. 
     * @param {Promise} promise - Promise object representing the success of selection operation.
     */
    async setOperatingMode(mode) {

        let mode_id = modes.isValidMode(mode)

        if (!mode_id) {
            console.log("Invalid mode")
            return false
        }

        await this.execute([
            '0x' + mode_id.charAt(0) + mode_id.charAt(1),   // mode byte
            0x00,
            0x00,
            0x00,
            0x07 // set operating mode 
        ])

        return true

    }


    /**
    * @typedef FreqAndMode
    * @property {string} freq_full - Full frequency
    * @property {number} mhzs - MHz
    * @property {number} hhzs - kHz
    * @property {number} hzs - Hz
    * @property {number} node_id - mode number
    * @property {string} mode_name - mode name
    */

    /**
     * Get frequency and mode from the radio
     * @return {Promise<FreqAndMode>} Promise object represents the frequency and mode
     */
    async getFreqAndMode() {

        await this.execute([0x00, 0x00, 0x00, 0x00, 0x03], 5, false)

        if (!this.response) {
            console.log("Radio not turned on")
            return false
        }
    
        // Get mode by substringing last two digits
        let mode_id = this.response.substring(8)
        let mode_name = modes.getModeNameById(mode_id)

        // Get frequency also by substringing it
        let freq_full = resp.substring(0, 8)

        // Strings to ints
        let mhzs = parseInt(freq_full.substring(0, 3))
        let khzs = parseInt(freq_full.substring(3, 6))
        let hzs = parseInt(freq_full.substring(6, 8))

        return {
            frequency: freq_full,
            mhzs,
            khzs,
            hzs,
            mode_id,
            mode_name,
        }

    }

    /**
     * Get receiver status from the radio
     * @return {string} Binary string containing one byte of data representing the receiver's status
     */
    async getReceiverStatus() {

        await this.execute([0x00, 0x00, 0x00, 0x00, 0xE7], 1, false)
        let b = hexToBin(this.response)

        // Bit 7 is 0 if there is a signal and 1 if the receiver is squelched
        let squelched = b & 0b10000000 ? true : false

        // Bits 0-3 contain S-meter values    
        let s = b & 0b00001111
        let smeter_reading
        if (s <= 9) {
            smeter_reading = 'S' + s.toString()
        } else {
            // For example 'S9+10dB'
            smeter_reading = 'S9+' + ((s-9) * 10).toString() + 'dB'
        }

        return {
            smeter_reading,
            squelched
        }
    }

    /**
     * Get transmitter status from the radio.
     * NOTE: these values can not be trusted if radio is not transmitting.
     *       Trust other values when this method returns that pttActive is true.
     * @return {Promise} 
     */
    async getTransmitterStatus() {
        
        await this.execute([0x00, 0x00, 0x00, 0x00, 0xF7], 1, false)
        let b = hexToBin(this.response)

        // Bit 7 indicates whether PTT is active or low. Bit is high if PTT is NOT active.
        let pttActive = b & 0b10000000 ? false : true

        /**
         * Bit 6 indicates if SWR is too high. 
         * Bit high for too high SWR. Zero for acceptably level.
         * NOTE: this value can not be trusted when radio not TXing. 
         *       On RX shows that HSWR is true.
         */
        let highSWR = b & 0b01000000 ? true : false

        /**
         * Bit 5 indicates if split mode is on. 
         * High if SPL mode is on.
         * NOTE: this value can not be trusted when radio not TXing. 
         *       On RX shows that split mode is true even if its not.
         */
        let splitModeOn = b & 0b00100000 ? true : false

        return {
            pttActive,
            highSWR,
            splitModeOn,
        }
    }


    /**
     * Lock or unlock the radio's dial/panel.
     * @param {boolean} [lock=false] - Lock (true) or unlock (false) radio. By default unlocking the radio.
     * @return {Promise} Promise object represents the success of locking/unlocking
     */
    async setLock(lock = false) {

        if (lock) {
            await this.execute([0x00, 0x00, 0x00, 0x00, 0x00], 1)    // Lock the radio
        } else {
            await this.execute([0x00, 0x00, 0x00, 0x00, 0x80], 1)    // Unlock the radio
        }

        // Returns 00 if operation done and F0 if already on that state
        if (this.response === '00') {
            return true
        } else if (this.response == 'f0'){
            throw new Error(lock ? "Already locked" : "Already unlocked")
        } else {
            throw new Error("Unknown response from the radio")
        }
    }

    /**
     * Push PTT or release PTT
     * @param {boolean} [activatePTT=false] - Active PTT or release PTT
     * @return {Promise} Promise object represents the success of activating/releasing PTT
     */
    async setPTT(activatePTT = false) {
        
        if (activatePTT) {
            await this.execute([0x00, 0x00, 0x00, 0x00, 0x08], 1)    // Set PTT on
        } else {
            await this.execute([0x00, 0x00, 0x00, 0x00, 0x88], 1)    // Set PTT off
        }

        // Returns 00 if operation done and F0 if already on that state
        if (this.response === '00') {
            return true
        } else if (this.response == 'f0'){
            throw new Error(activatePTT ? "PTT already active" : "PTT already off")
        } else {
            throw new Error("Unknown response from the radio")
        }
    }

    /**
     * Activate or deactivate CTCSS. This will enable both encoding and decoding!
     * @param {boolean} [activateCTCSS=false] - Activate or deactivate CTCSS.
     * @return {Promise} Promise object represents the success of activating/deactivating CTCSS
     */
    async setCTCSS(activateCTCSS = false) {
        if (activateCTCSS) {
            await this.execute([0x2A, 0x00, 0x00, 0x00, 0x0A], 1)
        } else {
            await this.execute([0x8A, 0x00, 0x00, 0x00, 0x0A], 1)
        }
        return true
    }

    /**
     * Set CTCSS frequency to the radio.
     * Accepts frequencies as both, numbers and string.
     * @param {number | string} frequency - Frequency that will be set as CTCSS frequency
     * @return {Promise} Promise object represents the success sending CTCSS frequency to the radio
     */
    async setCTCSSFrequency(frequency) {

        return new Promise(async (resolve, reject) => {

            let f = frequencies.isValidCTCSSFrequency(frequency)

            if (!f) {
                reject(new Error("CTCSS frequency does not exist"))
            }

            await this.execute([
                '0x' + f.charAt(0) + f.charAt(1),
                '0x' + f.charAt(2) + f.charAt(3),
                0x00,
                0x00,
                0x0B 
            ])

            resolve(true)
        })

    }
    
}

module.exports = FT817