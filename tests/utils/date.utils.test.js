require('jest')

const dateUtils = require('../../utils/date.utils')

describe('Date utils', () => {
    describe('normalizeDate()', () => {
        test('should return a date object', () => {
            const dateObj = dateUtils.normalizeDate(new Date(Date.now()))
            const dateInt = dateUtils.normalizeDate(Date.now())

            expect(dateObj).toBeInstanceOf(Date)
            expect(dateInt).toBeInstanceOf(Date)
        })
    })

    describe('formatDateSmart()', () => {
        const today = dateUtils.normalizeDate(1490913628756)
        const yesterday = dateUtils.normalizeDate(1490913628756 - 8.64e+7)
        const other = dateUtils.normalizeDate(1490913628756 - 1.728e+8)

        test('should return today', () => {
            expect(dateUtils.formatDateSmart(today, today)).toBe('today')
        })

        test('should return yesterday', () => {
            expect(dateUtils.formatDateSmart(yesterday, today)).toBe('yesterday')
        })

        test('should return a formatted date', () => {
            expect(dateUtils.formatDateSmart(other, today)).toBe('Tuesday, 28 Mar 2017')
        })
    })

    describe('formatSateStandard()', () => {
        const today = new Date(2017, 5, 7)

        test('should return a standard date format', () => {
            expect(dateUtils.formatDateStandard(today)).toBe('Wednesday, 7 Jun 2017')
        })
    })

    describe('formatDate()', () => {
        const today = new Date(2017, 5, 1)

        test('should return a smart format date', () => {
            expect(dateUtils.formatDate(today, 'smart')).toBe('Thursday, 1 Jun 2017')
        })

        test('should return a standard format date', () => {
            expect(dateUtils.formatDate(today)).toBe('Thursday, 1 Jun 2017')
        })
    })
})
