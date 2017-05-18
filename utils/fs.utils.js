const fs = require('fs')
const path = require('path')

/**
 * Write a file path, create directories that do not exist
 * @param {String} fullPath
 * @param {*} file
 */
module.exports.deepWriteSync = (fullPath, file) => {
    path.parse(fullPath).dir.split('/').reduce((partPath, dir) => {
        const newPath = [...partPath, dir]
        const test = newPath.join('/')

        if (test && !fs.existsSync(test)) {
            fs.mkdirSync(test)
        }

        return newPath
    }, [])

    fs.writeFileSync(fullPath, file)
}
