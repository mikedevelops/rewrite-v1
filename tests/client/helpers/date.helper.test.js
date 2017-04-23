import { expect } from 'chai'
import { describe, it } from 'mocha'
import * as dateHelpers from '../../src/helpers/date.helper'

describe('date helpers', () => {
    describe('normalizeDate()', () => {
        it('should return a date object', () => {
            const { normalizeDate } = dateHelpers
            const dateObj = normalizeDate(new Date(Date.now()))
            const dateInt = normalizeDate(Date.now())
            expect(dateObj).to.be.a('date')
            expect(dateInt).to.be.a('date')
        })
    })

    describe('formatDateSmart()', () => {
        const { formatDateSmart, normalizeDate } = dateHelpers
        const today = normalizeDate(1490913628756)
        const yesterday = normalizeDate(1490913628756 - 8.64e+7)
        const other = normalizeDate(1490913628756 - 1.728e+8)

        it('should return today', () => {
            expect(formatDateSmart(today, today)).to.equal('today')
        })

        it('should return yesterday', () => {
            expect(formatDateSmart(yesterday, today)).to.equal('yesterday')
        })

        it('should return a formatted date', () => {
            expect(formatDateSmart(other, today))
                .to.equal('Tuesday, 28 Mar 2017')
        })
    })

    describe('formatDate()', () => {
        const { normalizeDate, formatDate } = dateHelpers
        const today = normalizeDate(Date.now())

        it('should return a smart format date', () => {
            expect(formatDate(today, 'smart')).to.equal('today')
        })
    })
})
