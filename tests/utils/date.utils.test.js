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

    describe('formatDate()', () => {
        const today = dateUtils.normalizeDate(Date.now())

        test('should return a smart format date', () => {
            expect(dateUtils.formatDate(today, 'smart')).toBe('today')
        })
    })
})
