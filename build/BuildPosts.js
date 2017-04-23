const path = require('path')
const fs = require('fs')
const { getAllPosts } = require('../server/helpers/posts.helper')
const shortid = require('shortid')
const defaults = { src: path.resolve(__dirname, '../') }

class BuildPosts {
    constructor (options) {
        this.options = Object.assign({}, defaults, options)
        this.memManifest = []
        // determine if a post manifest exists
        try {
            this.fileManifest = JSON.parse(
                fs.readFileSync(path.join(this.options.src, 'post-manifest.json'), 'utf-8')
            )
        } catch (err) {
            this.fileManifest = { posts: [] }
        }
    }

    /**
     * Determine if a post is unique
     * @param {Object} post
     * @returns {Boolean}
     */
    filterUnique (post) {
        if (this.fileManifest.posts.length) {
            return !this.fileManifest.posts.find(manifestPost => post.date === manifestPost.date)
        } else {
            return true
        }
    }

    /**
     * Add post object to in-memory manifest
     * @param {Object} post
     */
    createManifestEntry (post) {
        // validate the post data object
        if (!post.title.length) {
            throw new Error('Cannot save a post without a title')
        } else if (!post.author.length) {
            throw new Error('Cannot save a post without an author')
        } else if (!post.date) {
            throw new Error('Cannot save a post without a date')
        }

        post._id = shortid.generate()
        this.memManifest.push(post)
    }

    /**
     * Return a timestamp for the manifest
     * @returns {Date}
     */
    static createManifestTimestamp () {
        return new Date(Date.now())
    }

    /**
     * Return the next manifest version
     * @returns {String}
     */
    getManifestVersion () {
        const currentVersion = this.fileManifest.version
        // if this is the first time
        if (!currentVersion) {
            return `${BuildPosts.version}.0.0`
        }

        const major = BuildPosts.version
        const minor = parseInt(currentVersion.split('.')[1])
        // increment minor version if we have created a production bundle
        const nextMinor = process.env.NODE_ENV === 'production' ? minor + 1 : minor
        const bug = 0

        return `${major}.${nextMinor}.${bug}`
    }

    /**
     * Merge memory and file manifest and write result
     */
    writeManifestToFile () {
        const posts = [...this.fileManifest.posts, ...this.memManifest]
        const createdAt = BuildPosts.createManifestTimestamp()
        const manifest = { createdAt, posts, version: this.getManifestVersion() }

        fs.writeFileSync(
            path.join(this.options.src, 'post-manifest.json'),
            JSON.stringify(manifest),
            'utf-8'
        )
    }

    /**
     * Build post manifest
     * @param {Object} compiler
     * @param {Function} next
     */
    build (compiler, next) {
        // - get posts from the post directory
        // - filter for markdown files
        // - filter for unique posts and add to in-memory manifest
        getAllPosts(this.options.src)
            .filter(post => this.filterUnique(post))
            .forEach(post => this.createManifestEntry(post))
        // write memory manifest to file manifest
        this.writeManifestToFile()
        next()
    }

    /**
     * Called by webpack to initiate the plugin
     * @param compiler
     */
    apply (compiler) {
        compiler.plugin('emit', this.build.bind(this))
    }
}

BuildPosts.version = 1
module.exports = BuildPosts
