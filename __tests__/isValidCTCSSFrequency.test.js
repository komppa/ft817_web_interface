const { isValidCTCSSFrequency } = require('../frequencies')

describe('Test eepromWriteProtection function', () => {


    // Test with correct freqs 
    test('Test that 670 passes', () => {
        expect(isValidCTCSSFrequency(670)).toBe(true)
    })

    test('Test that 1567 passes', () => {
        expect(isValidCTCSSFrequency(1567)).toBe(true)
    })

    test('Test that 2541 passes', () => {
        expect(isValidCTCSSFrequency(2541)).toBe(true)
    })


    // and freqs using strings
    test('Test that string 670 passes', () => {
        expect(isValidCTCSSFrequency('670')).toBe(true)
    })

    test('Test that string 670 passes with one leading zero', () => {
        expect(isValidCTCSSFrequency('0670')).toBe(true)
    })


    // Tests with freqs that should be invalid
    test('Test that 650 do not pass', () => {
        expect(isValidCTCSSFrequency(650)).toBe(false)
    })

    test('Test that 2600 do not pass', () => {
        expect(isValidCTCSSFrequency(2600)).toBe(false)
    })

    // and for strings
    test('Test that 650 do not pass', () => {
        expect(isValidCTCSSFrequency('650')).toBe(false)
    })

    test('Test that 2600 do not pass', () => {
        expect(isValidCTCSSFrequency('2600')).toBe(false)
    })


    // Check other invalid args
    test('Test when no args at all', () => {
        expect(isValidCTCSSFrequency()).toBe(false)
    })

    test('Test when empty string', () => {
        expect(isValidCTCSSFrequency('')).toBe(false)
    })

    test('With negative number', () => {
        expect(isValidCTCSSFrequency(-670)).toBe(false)
    })

    test('Test when empty string', () => {
        expect(isValidCTCSSFrequency(0)).toBe(false)
    })
  

})