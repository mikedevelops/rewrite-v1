require('jest')

const util = require('../../utils/fs.utils')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

describe('File system utils', () => {
    const base = path.join(__dirname, 'fs')

    beforeEach(() => {
        fs.mkdirSync(base)
    })

    afterEach(() => {
        rimraf.sync(base)
    })

    describe('deepWriteSync()', () => {
        test('should recursively create directories that do not exist', () => {
            const file = path.join(base, 'foo/bar/foo.txt')

            util.deepWriteSync(file, 'Hello, World!')
            expect(fs.existsSync(file)).toBeTruthy()
        })
    })
})
