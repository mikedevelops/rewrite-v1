const path = require('path')
const fs = require('fs')
const marked = require('meta-marked')

/**
 * Read posts directory and convert to object
 * @param  {String} assetPath
 * @return {Array}
 */
function getAllPosts (assetPath) {
    return fs.readdirSync(path.join(assetPath, 'posts'))
    .reduce((data, post) => {
        const location = path.join(assetPath, 'posts', post)
        const file = fs.readFileSync(location, 'utf-8')
        data.push(marked(file).meta)
        return data
    }, [])
}

module.exports = { getAllPosts }
