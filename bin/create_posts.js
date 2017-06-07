/**
 * Create post fixtures
 **/
const ipsum = require('../utils/ipsum')
const fs = require('fs')
const path = require('path')
const program = require('commander')
const inquirer = require('inquirer')
const postsDir = path.resolve(__dirname, '../posts')

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

const questions = [
    {
        type: 'input',
        name: 'posts',
        message: 'Number of posts to create',
        default: 10
    }
]

program
    .version('0.1.0')
    .parse(process.argv)

inquirer.prompt(questions).then(answers => {
    for (let i = 0; i < answers.posts; i++) {
        writePost(
            path.join(postsDir, getPostTitle(i)),
            createPost(`test post ${i}`, ipsum)
        )
    }
})
