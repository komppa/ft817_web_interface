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

    
        