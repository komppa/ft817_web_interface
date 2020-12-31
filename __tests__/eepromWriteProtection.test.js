const FT817 = require('../ft817')

describe('Test eepromWriteProtection function', () => {

    var ft817 = null
    jest.setTimeout(50000)

    beforeEach(() => {
        ft817 = new FT817('COM1')   // Port doesn't really matter
    })
    
    test('Test that write protection returns true when called for the first time', () => {
        expect(ft817.eepromWriteProtection()).toBe(true)
    })

    test('Test that write protection returns true when 2nd call comes >2 seconds later than the 1st one', async done => {
        ft817.eepromWriteProtection()
        setTimeout(() => {
            expect(ft817.eepromWriteProtection()).toBe(true)
            done()
        }, 2500)
    })

    test('Test that write protection returns true when 7th call comes >2 seconds later than the 6th one', async done => {

        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        setTimeout(() => {
            expect(ft817.eepromWriteProtection()).toBe(true)
            done()
        }, 2500)        
    })

    test('Test that write protection returns false when 7th call comes <2 seconds later than the 6th one', async done => {

        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()
        ft817.eepromWriteProtection()

        setTimeout(() => {
            expect(ft817.eepromWriteProtection()).toBe(false)
            done()
        }, 1500)
        
    })

    test('Test that write protection returns true for calls 1, 2, 3, 4, 5 and 6, but false for calls 7 and 8 <2 seconds later and true for call 9 >2 seconds later', async done => {

        // 1
        expect(ft817.eepromWriteProtection()).toBe(true)
        // 2
        expect(ft817.eepromWriteProtection()).toBe(true)
        // 3
        expect(ft817.eepromWriteProtection()).toBe(true)
        // 4
        expect(ft817.eepromWriteProtection()).toBe(true)
        // 5
        expect(ft817.eepromWriteProtection()).toBe(true)
        // 6
        expect(ft817.eepromWriteProtection()).toBe(true)

        setTimeout(() => {
            // 7
            expect(ft817.eepromWriteProtection()).toBe(false)
            setTimeout(() => {
                // 8 
                expect(ft817.eepromWriteProtection()).toBe(false)
                setTimeout(() => {
                    // 9
                    expect(ft817.eepromWriteProtection()).toBe(true)
                    done()
                }, 2300)
            }, 1000)
        }, 1500)
        
    })

    test('Test that write protection returns true on calls 1, 2, 3, 4, 5 and 6 when they come <2 seconds of each other', async done => {
        let counter = 1
        var timer = setInterval(() => {
            if(counter !== 7) {
                expect(ft817.eepromWriteProtection()).toBe(true)
                counter = counter + 1
            } else {
                // 7th call returns false because it's called <2 sec later
                expect(ft817.eepromWriteProtection()).toBe(false)
                clearInterval(timer)
                done()
            }
        }, 1500);
        
    })

    test('Test that write protection returns true on calls 1, 2, 3, 4, 5 and 6 when they come >2 seconds apart', async done => {
        let counter = 1
        var timer = setInterval(() => {
            if(counter !== 7) {
                expect(ft817.eepromWriteProtection()).toBe(true)
                counter = counter + 1
            } else {
                // 7th call returns true because it's called >2 sec later
                expect(ft817.eepromWriteProtection()).toBe(true)
                clearInterval(timer)
                done()
            }
        }, 2500);
        
    })
})