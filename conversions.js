/**
 * Converts hex buffer to the binary literal buffer
 * @param {string} hex - hex buffer 
 * @param {number} [length=1] - length in bytes
 * @return {string} Binary literal buffer
 */
exports.hexToBin = (hex, length = 1) => {
    let binstr = (parseInt(hex, 16)
        .toString(2))
        .padStart(8 * length , '0')
    let binlit = '0b' + binstr
    return binlit
}

exports.hexToDec = (hex) => {
    return parseInt(hex, 16);
}

exports.decToHex = (dec) => {
    return dec.toString('hex')
}