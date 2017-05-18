const marked = require('meta-marked')
const md5 = require('md5')
const fs = require('fs')
const path = require('path')
const util = require('../utils/fs.utils')

/**
 * create post object
 * @param {String} filename
 * @param {String} content
 * @returns {Object} post object
 */
module.exports.createPostObject = (filename, content) => {
    const { meta, html, markdown } = marked(content)

    if (!meta.title) {
        throw new Error('No post title found in metadata')
    }

    if (!meta.author) {
        throw new Error('No post author found in metadata')
    }

    if (!meta.lead) {
        throw new Error('No post lead paragraph found in metadata')
    }

    if (meta.lead.trim().length > 140) {
        throw new Error('Post lead exceeds 140 characters')
    }

    return {
        file: filename,
        title: meta.title.trim(),
        author: meta.author.trim(),
        lead: meta.lead.trim(),
        createdAt: module.exports.getPostDate(filename),
        lastModified: 'v2',
        id: module.exports.createPostId(filename),
        archived: false,
        html,
        markdown
    }
}

/**
 * Create post ID
 * @param {String} title
 * @returns {String} post id
 */
module.exports.createPostId = (title) => {
    return md5(title)
}

/**
 * Create post slug
 * @param {String} title
 * @returns {String} slug
 */
module.exports.createPostSlug = (title) => {
    return title.replace(/[\W_]/g, '-').replace(/-{2,}/g, '-')
}

/**
 * Merge two sets of post object arrays
 * @param {Array} posts
 * @param {Array} modifiedPosts
 * @returns {Array}
 */
module.exports.mergePostObjectArrays = (posts, modifiedPosts) => {
    modifiedPosts.forEach(post => {
        const match = posts.find(p => p.id === post.id)

        if (match) {
            posts[posts.findIndex(p => p.id === match.id)] = post
        } else {
            posts.push(post)
        }
    })

    return posts
}

/**
 * Merge two post objects in the event of an update, excludes 'protected' / read-only
 * properties such as id, createdAt, file
 * @param {Object} oldPost
 * @param {Object} newPost
 * @param {Date} time
 * @returns {Object} updated post
 */
module.exports.mergePostObjects = (oldPost, newPost, time = new Date()) => {
    const readOnly = ['id', 'createdAt', 'file']

    return Object.keys(oldPost).reduce((post, key) => {
        if (readOnly.find(k => k === key)) {
            newPost[key] = oldPost[key]
        }

        if (key === 'lastModified') {
            newPost[key] = time
        }

        return newPost
    }, newPost)
}

/**
 * Validate a post filename and return date
 * @param {String} post
 * @returns {Date} post date
 */
module.exports.getPostDate = (post) => {
    const date = new RegExp(/^(\d{1,2})-(\d{1,2})-(\d{4})/).exec(post)

    if (!date) {
        throw new Error('could not parse date, format should be DD-MM-YYYY-title')
    }

    const day = parseInt(date[1])
    const month = parseInt(date[2])
    const year = parseInt(date[3])

    if (!day) {
        throw new Error('could not parse post date (day), format should be DD-MM-YYYY-title')
    }

    if (!month) {
        throw new Error('could not parse post date (month), format should be DD-MM-YYYY-title')
    }

    if (!year) {
        throw new Error('could not parse post date (year), format should be DD-MM-YYYY-title')
    }

    // month is zero indexed
    return new Date(year, (month - 1), day)
}

/**
 * Write post to file
 * @param {Object} postObject
 * @param {String} dir
 */
module.exports.writePost = (postObject, dir) => {
    const { id } = postObject
    const filePath = path.join(dir, `${id}.json`)

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }

    util.deepWriteSync(filePath, JSON.stringify(postObject))
}

module.exports.getPosts = (manifest) => {

}
