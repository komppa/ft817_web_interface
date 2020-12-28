exports.hexToBin = hex => {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0')
}

exports.decToHex = dec => {
    return parseInt(dec, 16)
}
