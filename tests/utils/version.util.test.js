const { describe, it } = require('mocha')
const { expect } = require('chai')
const { getVersionObject, setVersionObject, bumpVersion } = require('../../utils/version.util')

describe('version helpers', () => {
    describe('getVersionObject()', () => {
        it('should return a version object', () => {
            expect(getVersionObject('1.2.3')).to.deep.equal({
                major: 1,
                minor: 2,
                bug: 3
            })
        })
    })

    describe('setVersionObject()', () => {
        it('should convert a version object to a string', () => {
            expect(setVersionObject({ major: 1, minor: 2, bug: 3 })).to.equal('1.2.3')
        })
    })

    describe('bumpVersion()', () => {
        it('should bump major version', () => {
            expect(bumpVersion('1.2.3', 'major')).to.equal('2.0.0')
        })

        it('should bump minor version', () => {
            expect(bumpVersion('1.2.3', 'minor')).to.equal('1.3.3')
        })

        it('should bump bug version', () => {
            expect(bumpVersion('1.2.3', 'bug')).to.equal('1.2.4')
        })
    })
})
