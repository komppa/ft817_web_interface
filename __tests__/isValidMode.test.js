const FT817 = require('../ft817')
const modes = require('../modes')

describe('Test isValidMode function', () => {

    var ft817 = null

    beforeEach(() => {
        ft817 = new FT817('COM12')   // Port doesn't really matter
    })
    
    /**
     * Tests that are passing correct mode name as string
     */

    test('Mode for LSB', () => {
        expect(modes.isValidMode('LSB')).toBe('00')
    })

    test('Mode for USB', () => {
        expect(modes.isValidMode('USB')).toBe('01')
    })

    test('Mode for CW', () => {
        expect(modes.isValidMode('CW')).toBe('02')
    })

    test('Mode for CWR', () => {
        expect(modes.isValidMode('CWR')).toBe('03')
    })

    test('Mode for AM', () => {
        expect(modes.isValidMode('AM')).toBe('04')
    })

    // Manually forcing WideFM is disabled
    test('Mode for WFM', () => {
        expect(modes.isValidMode('WFM')).toBe(false)
    })

    test('Mode for FM', () => {
        expect(modes.isValidMode('FM')).toBe('08')
    })

    test('Mode for DIG', () => {
        expect(modes.isValidMode('DIG')).toBe('0A')
    })

    test('Mode for PKT', () => {
        expect(modes.isValidMode('PKT')).toBe('0C')
    })


    /**
     * Tests that are passing incorrect mode name in as string
     */
    
    test('String for mode that does not exist', () => {
        expect(modes.isValidMode('INCORRECT_MODE')).toBe(false)
    })

    test('String for mode that does not exist but are close', () => {
        expect(modes.isValidMode('DFM')).toBe(false)
    })


    /**
     * Tests that are passing incorrect argumenents
     */

    test('Empty string', () => {
        expect(modes.isValidMode('')).toBe(false)
    })

    test('No arg at all', () => {
        expect(modes.isValidMode()).toBe(false)
    })

    test('Negative number', () => {
        expect(modes.isValidMode(-1)).toBe(false)
    })


    /**
     * Tests for number as string. No handing, returns that it is invalid.
     */

    test('LSB in using number 0', () => {
        expect(modes.isValidMode('0')).toBe(false)
    })


    /**
     * Tests for number as number
     */
    test('LSB in using number 0', () => {
        expect(modes.isValidMode(0)).toBe('00')
    })

    test('USB in using number 1', () => {
        expect(modes.isValidMode(1)).toBe('01')
    })

    test('CW in using number 2', () => {
        expect(modes.isValidMode(2)).toBe('02')
    })

    test('CWR in using number 3', () => {
        expect(modes.isValidMode(3)).toBe('03')
    })

    test('AM in using number 4', () => {
        expect(modes.isValidMode(4)).toBe('04')
    })

    // Manually forcing WideFM is disabled
    test('WFM in using number 6', () => {
        expect(modes.isValidMode(6)).toBe(false)
    })

    test('FM in using number 8', () => {
        expect(modes.isValidMode(8)).toBe('08')
    })

    test('DIG in using number 10', () => {
        expect(modes.isValidMode(10)).toBe('0A')
    })

    test('PKT in using number 12', () => {
        expect(modes.isValidMode(12)).toBe('0C')
    })
        
})