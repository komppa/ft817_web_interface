const modes = [
    {
        "name": "LSB",
        "id": 0
    }, 
    {
        "name": "USB",
        "id": 1
    }, 
    {
        "name": "CW",
        "id": 2
    }, 
    {
        "name": "CWR",
        "id": 3
    }, 
    {
        "name": "AM",
        "id": 4
    }, 
    /*
        WideFM option is disabled. 
        If setting broadcast band, Yaesu 
        will automatically select WFM as 
        operating mode.
    {
        "name": "WFM",
        "id": 6
    },
    */ 
    {
        "name": "FM",
        "id": 8
    }, 
    {
        "name": "DIG",
        "id": 10
    }, 
    {
        "name": "PKT",
        "id": 12
    }, 
    
]


exports.getModeNameById = (mode) => {
    let id = parseInt(mode, 16)
    let mode_obj = modes.find(ms => ms.id === id)
    return mode_obj.name
}

/**
 * Validates if mode is legal based on its nade or id. 
 * On valid mode, returns the hex string (mode byte)
 * or boolean value false if is not valid.
 * @param {string | number} mode - Mode that will be validated. Can be either string or number.
 * @return {string | bool} Hex string that corresponds to the mode. Boolean false if mode is not valid.
 */
exports.isValidMode = (mode) => {

    if (typeof mode === 'string') {
        // If validated mode is given as a string, find mode for it
        let m = modes.find(md => md.name === mode)
        
        // If mode found, add leading zero if needed
        if (m) {
            // Found mode corresponding the given string mode name
            if (m.id <= 9) {
                return '0' + m.id.toString()
            } else {
                // Converts number to corresponding hex character. Also make hex character uppercase.
                return '0' + m.id.toString(16).toUpperCase()
            }
            // return m.id <= 9 ?  + '0' + m.id.toString() : '0' + (m.id).toString(16).toUpperCase()
        } else {
            // Could not find the mode
            return false
        }

    } else if (typeof mode === 'number') {
        // If validated mode is given as a number

        // TODO IS NUMBER HEX OR A STRING?
        let m = modes.find(ms => ms.id === mode)
        return m ? '0' + m.id.toString(16).toUpperCase() : false
    } else {
        // Given mode was not string or number, discard it
        return false
    }
}