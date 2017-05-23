require('jest')

const stringUtils = require('../../utils/string.utils')

describe('String utils', () => {
    describe('capatalize()', () => {
        test('should capatalize a string', () => {
            expect(stringUtils.capatalize('foobar')).toBe('Foobar')
        })
    })
})
