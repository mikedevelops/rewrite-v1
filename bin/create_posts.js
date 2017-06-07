/**
 * Create post fixtures
 **/
const ipsum = require('../utils/ipsum')
const fs = require('fs')
const path = require('path')
const posts = path.resolve(__dirname, '../posts')
const total = 25

/**
 * Create fixture post content
 * @param {String} title
 * @param {String} content
 * @returns {string} content
 */
function createPost (title, content) {
    const meta = `---\ntitle: ${title}\nauthor: Michael Smart\nlead: Lorem markdownum germana mediis\n...\n`
    return meta + content
}

/**
 * Write fixture post to disk
 * @param {String} file
 * @param {String} post
 */
function writePost (file, post) {
    fs.writeFileSync(file, post, 'utf-8')
}

/**
 * Create random fixture post title
 * @param {Number} index
 * @returns {string} title
 */
function getPostTitle (index) {
    // todo - get a random date and title
    return `7-6-2017-test-${index}.md`
}

for (let i = 0; i < total; i++) {
    writePost(path.join(posts, getPostTitle(i)), createPost(`test post ${i}`, ipsum))
}

console.log('post fixtures created')
process.exit(0)
