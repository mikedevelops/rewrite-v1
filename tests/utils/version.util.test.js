require('jest')

const versionUtils = require('../../utils/version.util')

describe('Version utils', () => {
    describe('getVersionObject()', () => {
        test('should return a version object', () => {
            expect(versionUtils.getVersionObject('1.2.3')).toEqual({
                major: 1,
                minor: 2,
                bug: 3
            })
        })
    })

    describe('setVersionObject()', () => {
        test('should convert a version object to a string', () => {
            expect(versionUtils.setVersionObject({ major: 1, minor: 2, bug: 3 })).toBe('1.2.3')
        })
    })

    describe('bumpVersion()', () => {
        test('should bump major version', () => {
            expect(versionUtils.bumpVersion('1.2.3', 'major')).toBe('2.0.0')
        })

        test('should bump minor version', () => {
            expect(versionUtils.bumpVersion('1.2.3', 'minor')).toBe('1.3.3')
        })

        test('should bump bug version', () => {
            expect(versionUtils.bumpVersion('1.2.3', 'bug')).toBe('1.2.4')
        })
    })
})
