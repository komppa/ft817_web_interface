/**
 * FOR READ RECEIVER STATUS
 *      - getSquelched
 *      - getSMeter
 */


/**
 * Bit 7 is 0 if there is a signal and 1 if the receiver is squelched
 */
exports.getSquelched = (data) => {
    return parseInt(data[0]) ? true : false
}

/**
 * Bits 0-3 contain S-meter values
 */
exports.getSMeter = (data) => {
    
    // Convert value coming in from binary format to the hex format
    let value = parseInt(data.substring(4, 8), 2).toString(16)

    // Init vars
    let meter_value = 0
    let meter_value_name = ''

    switch (value) {
           
        case 'a':
            meter_value_name = 'S9+10dB'
            break

        case 'b':
            meter_value_name = 'S9+20dB'
            break

        case 'c':
            meter_value_name = 'S9+30dB'
            break

        case 'd':
            meter_value_name = 'S9+40dB'
            break

        case 'e':
            meter_value_name = 'S9+50dB'
            break

        case 'f':
            meter_value_name = 'S9+60dB'
            break

        default:
            // Grabs rest, all number values
            meter_value_name = 'S'+ value.toString()
            break

    }

    // Return object that contains radio's returned value in hex 
    // and also S-Meter reading in string
    return {
        meter_value: value.toString(),
        meter_value_name
    }

}



/**
 * FOR READ TRANSMITTER STATUS
 * ---------------------------
 * 
 *      - getPowerOutput
 *      - getSlitModeStatus
 *      - getHighSWRStatus
 *      - getPTTOn
 */


/**
 * Bits 0-3 contain power output reading
 */
 exports.getPowerOutput = (data) => {

    // Convert value coming in from binary format to the hex format
    let value = parseInt(data.substring(4, 8), 2).toString(16)

}