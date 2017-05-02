const path = require('path')
const fs = require('fs')
const marked = require('meta-marked')

/**
 * Read posts and return all posts metadata
 * @param  {String} postDirectory
 * @return {Array}
 */
function getAllPosts (postDirectory) {
    // read posts directory
    return fs.readdirSync(postDirectory)
        .reduce((data, post) => {
            // ignore non markdown files
            if (path.extname(post) === '.md') {
                // get path to post
                const location = path.join(postDirectory, post)
                // read post file
                const file = fs.readFileSync(location, 'utf-8')
                // return post metadata
                data.push(marked(file).meta)
            }

            return data
        }, [])
}

/**
 * Get full post object, this includes...
 * - metadata
 * - HTML
 * - Markdown
 * @param postDirectory
 * @param post
 */
function getFullPostDataObject (postDirectory, post) {
    console.log(postDirectory, post)

    const location = path.join(postDirectory, post)
    const { meta, html } = marked(fs.readFileSync(location, 'utf-8'))
    return { meta, html }
}

/**
 * Get ID from post filename
 * @param filename
 * @returns {Number}
 */
function getPostId (filename) {
    return parseInt(filename.split(/-/)[0])
}

/**
 * Return post data by ID
 * @param postDirectory
 * @param id
 * @returns {Object}
 */
function getPostById (postDirectory, id) {
    const post = fs.readdirSync(postDirectory)
        .find(post => getPostId(post) === id)
    return getFullPostDataObject(postDirectory, post)

}

module.exports = {
    getAllPosts,
    getPostId,
    getPostById,
    getFullPostDataObject
}
