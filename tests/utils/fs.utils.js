const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const util = require('../../utils/fs.utils')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

describe('fs utils', () => {
    const base = path.join(__dirname, 'fs')

    beforeEach(() => {
        fs.mkdirSync(base)
    })

    afterEach(() => {
        rimraf.sync(base)
    })

    describe('deepWriteSync()', () => {
        it('should recursively create directories that do not exist', () => {
            const file = path.join(base, 'foo/bar/foo.txt')

            util.deepWriteSync(file, 'Hello, World!')
            expect(fs.existsSync(file)).to.be.true
        })
    })
})
