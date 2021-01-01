exports.isValidRxFrequency = (frequency) => {

    // 100khz - 30mhz 
    if (frequency >= 10000 && frequency <= 3000000) {
        // pass
        return true
    }

    // 50mhz - 54mhz
    if (frequency >= 5000000 && frequency <= 5400000) {
        return true
    }

    // 76mhz - 108mhz
    if (frequency >= 7600000 && frequency <= 10800000) {
        return true
    }

    // 87.5mhz - 108mhz
    if (frequency >= 8750000 && frequency <= 10800000) {
        return true
    }

    // 108mhz - 154mhz (FOR USA)
    /* if (frequency >= 10800000 && frequency <= 15400000) {
        return true
    }*/

    // 144mhz - 148mhz
    if (frequency >= 14400000 && frequency <= 14800000) {
        return true
    }

    // 430mhz - 450mhz
    if (frequency >= 43000000 && frequency <= 45000000) {
        return true
    }

    // All other cases will be rejected
    return false  

}


//TODO return freq in correct format (string, without leading zeros etc.)
exports.isValidCTCSSFrequency = (frequency) => {

    // Valid CTCSS frequencies
    const ctcssFreqs = [670,693,719,744,770,797,825,854,885,915,
                        948,974,1000,1035,1072,1109,1148,1188,1230,1273,
                        1318,1365,1413,1462,1514,1567,1598,1622,1655,1679,
                        1713,1738,1773,1799,1835,1862,1899,1928,1966,1995,
                        2035,2065,2107,2181,2257,2291,2336,2418,2503,2541]

    // If arg is string, convert integer to string
    if (!isNaN(frequency)) {
        frequency = parseInt(frequency)
    }

    let isValid = ctcssFreqs.includes(frequency)

    
    if (isValid) {
        // Add leading zero if needed
        let f = frequency.toString()
        return f.length < 4 ? '0' + f : f
    } else {
        // Frequency did not exist
        return false
    }


}