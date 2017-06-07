/**
 * clear posts directory
 **/
const fs = require('fs')
const path = require('path')
const postDir = path.resolve(__dirname, '../posts')
const posts = fs.readdirSync(postDir)
const program = require('commander')
const inquirer = require('inquirer')

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

const questions = [
    {
        type: 'confirm',
        name: 'posts',
        message: 'Are you sure you want to delete all posts?'
    },
    {
        type: 'confirm',
        name: 'manifest',
        message: 'Would you like to remove the post-manifest.json?'
    }
]

program
    .version('0.1.0')
    .parse(process.argv)

inquirer.prompt(questions).then(answers => {
    if (answers.posts) {
        posts.filter(filterPost).forEach(deletePost)
    }

    if (answers.manifest) {
        fs.unlinkSync(path.resolve(__dirname, '../post-manifest.json'))
    }
})
