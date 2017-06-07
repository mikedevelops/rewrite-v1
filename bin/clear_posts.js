/**
 * clear posts directory
 **/
const fs = require('fs')
const path = require('path')
const postDir = path.resolve(__dirname, '../posts')
const posts = fs.readdirSync(postDir)

/**
 * Delete single post
 * @param {String} post
 */
function deletePost (post) {
    fs.unlinkSync(path.join(postDir, post))
}

/**
 * Match post file
 * @param {String} file
 * @returns {Boolean}
 */
function filterPost (file) {
    return file.search(/^\d[a-zA-Z_\-0-9]+.md/) >= 0
}

posts.filter(filterPost).forEach(deletePost)
console.log('posts deleted!')
process.exit(0)
