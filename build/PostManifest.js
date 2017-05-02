const path = require('path')
const fs = require('fs')
const { version } = require('../package.json')
const defaults = {
    posts: path.resolve(__dirname, '../', 'posts'),
    manifest: path.resolve(__dirname, '../post-manifest.json')
}

class PostManifest {
    constructor (options) {
        this.options = Object.assign({}, defaults, options)
        this.manifest = this.getManifest(new Date(), version)
        this.modifiedPosts = this.getModifiedPosts()
    }

    /**
     * Return a vanilla manifest
     * @param {Date} date
     * @param {String} appVersion
     * @returns {{createdAt: Date, lastPublished: Date, app, version: string, posts: Array}}
     */
    static getBlankManifest (date, appVersion) {
        return {
            createdAt: date,
            lastPublished: date,
            app: appVersion,
            version: '1.0.0',
            posts: []
        }
    }

    /**
     * Checks existence of manifest in posts directory
     * @param {Date} date
     * @param {String} version
     * @returns {Boolean|Object}
     */
    getManifest (date, version) {
        try {
            return JSON.parse(fs.readFileSync(this.options.manifest, 'utf-8'))
        } catch (err) {
            return PostManifest.getBlankManifest(date, version)
        }
    }

    /**
     * Get posts that have been modified since the last published manifest
     * @returns {Array} posts
     */
    getModifiedPosts () {
        const posts = fs.readdirSync(this.options.posts)
        return posts.filter(post => path.extname(post) === '.md')
            .filter(post => {
                const { mtime } = fs.statSync(path.join(this.options.posts, post))

                if (this.manifest.version === '1.0.0' || mtime > this.manifest.lastPublished) {
                    return post
                }
            })
    }
}

module.exports = PostManifest
