const FT817 = require('../ft817')
const { ranByJest } = require('../ranByJest')


test('ranByJest function should return true on this test set', () => {
    expect(ranByJest()).toBe(true)
})


describe('Test setFrequency function', () => {

    var ft817 = null

    beforeEach(() => {
        ft817 = new FT817('COM1')   // Port doesn't really matter
    })

    test('without frequency parameter', () => {
        expect(ft817.setFrequency()).toBe('14575000')
    })

    test('with correct frequency string with leading zeros', () => {
        expect(ft817.setFrequency('02829750')).toBe('02829750')
    })

    test('with frequency that does not have leading zeros and is a string', () => {
        expect(ft817.setFrequency('2829750')).toBe('02829750')
    })

    test('with correct frequency that is integer but does not have leading zeros', () => {
        expect(ft817.setFrequency(2829750)).toBe('02829750')
    })

    /**
     * 100kHz - 30MHz
     */

    test('that under 100kHz is not valid', () => {
        expect(ft817.setFrequency(500)).toBe(false)
    })

    test('that 100kHz is valid ', () => {
        expect(ft817.setFrequency(10000)).toBe('00010000')
    })

    test('that 28MHz is valid', () => {
        expect(ft817.setFrequency('02800000')).toBe('02800000')
    })

    test('that 31MHz is invalid', () => {
        expect(ft817.setFrequency('03100000')).toBe(false)
    })

    /**
     * 50MHz - 54MHz
     */

    test('that under 50Mhz is invalid', () => {
        expect(ft817.setFrequency('04900000')).toBe(false)
    })

    test('that 50Mhz is valid', () => {
        expect(ft817.setFrequency('05000000')).toBe('05000000')
    })

    test('that 53Mhz is valid', () => {
        expect(ft817.setFrequency('05300000')).toBe('05300000')
    })

    test('that over 54Mhz is invalid', () => {
        expect(ft817.setFrequency('05500000')).toBe(false)
    })

    
    /**
     * 76MHz - 108MHz
     */

    test('that under 76Mhz is invalid', () => {
        expect(ft817.setFrequency('07500000')).toBe(false)
    })

    test('that 80Mhz is valid', () => {
        expect(ft817.setFrequency('08000000')).toBe('08000000')
    })

    test('that 101Mhz is valid', () => {
        expect(ft817.setFrequency('10100000')).toBe('10100000')
    })

    test('that over 108Mhz is invalid', () => {
        expect(ft817.setFrequency('11000000')).toBe(false)
    })

    
    /**
     * 87.5MHz - 108MHz
     */

    test('that under 87.5Mhz is valid (becuase prev band catches it)', () => {
        expect(ft817.setFrequency('08740000')).toBe('08740000')
    })

    test('that 80Mhz is valid', () => {
        expect(ft817.setFrequency('08000000')).toBe('08000000')
    })

    test('that 101Mhz is valid', () => {
        expect(ft817.setFrequency('10100000')).toBe('10100000')
    })

    test('that over 108Mhz is invalid', () => {
        expect(ft817.setFrequency('11000000')).toBe(false)
    })

    
    /**
     * 144MHz - 148MHz
     */

    test('that under 144Mhz is invalid', () => {
        expect(ft817.setFrequency('14300000')).toBe(false)
    })

    test('that 145.5MHz is valid', () => {
        expect(ft817.setFrequency('14550000')).toBe('14550000')
    })

    test('that 146Mhz is valid', () => {
        expect(ft817.setFrequency('14600000')).toBe('14600000')
    })

    test('that over 148Mhz is invalid', () => {
        expect(ft817.setFrequency('14900000')).toBe(false)
    })

    
    /**
     * 430MHz - 450MHz
     */

    test('that under 429Mhz is invalid', () => {
        expect(ft817.setFrequency('42900000')).toBe(false)
    })

    test('that 430MHz is valid', () => {
        expect(ft817.setFrequency('43000000')).toBe('43000000')
    })

    test('that 445Mhz is valid', () => {
        expect(ft817.setFrequency('44500000')).toBe('44500000')
    })

    test('that over 450Mhz is invalid', () => {
        expect(ft817.setFrequency('45050000')).toBe(false)
    })

})

