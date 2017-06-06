const path = require('path')
const fs = require('fs')
const utils = require('../utils/version.util')
const Hashid = require('hashids')
const defaults = {
    posts: path.resolve(__dirname, '../', 'posts'),
    manifest: path.resolve(__dirname, '../post-manifest.json')
}

process.env.TZ = 'London/Europe'

class PostManifest {
    /**
     * @param {Object} options
     * @param {Date} date
     * @param {String} appVersion
     * @param {String} env
     * @param {Object} postHelpers
     */
    constructor (options, date, appVersion, env = 'development', postHelpers) {
        this.env = env
        this.postHelpers = postHelpers
        this.appVersion = appVersion
        this.options = Object.assign({}, defaults, options)
        this.time = date
        this.manifest = this.getManifest()
    }

    /**
     * Return a vanilla manifest
     * @returns {Object} blank manifest
     */
    getBlankManifest () {
        return {
            createdAt: this.time,
            lastPublished: this.time,
            app: this.appVersion,
            version: '0.0.0',
            posts: []
        }
    }

    /**
     * Checks existence of manifest in posts directory
     * @returns {Object} manifest
     */
    getManifest () {
        try {
            return JSON.parse(fs.readFileSync(this.options.manifest, 'utf-8'))
        } catch (err) {
            return this.getBlankManifest()
        }
    }

    /**
     * Get posts that have been modified since the last published manifest
     * @returns {Array} posts
     */
    getModifiedPosts () {
        const posts = fs.readdirSync(this.options.posts)

        return posts.filter(post => path.extname(post) === '.md')
            .reduce((modPosts, post) => {
                const content = fs.readFileSync(path.join(this.options.posts, post), 'utf-8')
                const { mtime } = fs.statSync(path.join(this.options.posts, post), 'utf-8')
                const existingPost = this.manifest.posts.find(existing => existing.file === post)
                const newPost = this.postHelpers.createPostObject(
                    post,
                    content,
                    this.postHelpers.createPostSlug,
                    this.postHelpers.createPostId,
                    this.postHelpers.getPostDate,
                    new Hashid()
                )

                if (!existingPost) {
                    modPosts.push(newPost)
                } else if (mtime > Date.parse(this.manifest.lastPublished)) {
                    modPosts.push(this.postHelpers.mergePostObjects(existingPost, newPost, this.time))
                }

                return modPosts
            }, [])
    }

    bumpManifestVersion () {
        const app = utils.getVersionObject(this.appVersion)
        const manifest = utils.getVersionObject(this.manifest.version)

        if (app.major !== manifest.major) {
            return utils.bumpVersion(this.manifest.version, 'major')
        } else {
            return utils.bumpVersion(this.manifest.version, 'minor')
        }
    }

    /**
     * Write manifest to file
     * @param {Object} manifest
     */
    writeManifest (manifest) {
        fs.writeFileSync(this.options.manifest, JSON.stringify(manifest, null, 4), 'utf-8')
    }

    /**
     * Webpack apply method for using as a webpack plugin
     * @param {Object} compiler
     */
    apply (compiler) {
        compiler.plugin('done', () => {
            this.modifiedPosts = this.getModifiedPosts()
            this.newVersion = this.env === 'production' ? this.bumpManifestVersion() : this.manifest.version
            this.newManifest = Object.assign({}, this.manifest, {
                app: this.appVersion,
                version: this.newVersion,
                lastPublished: this.env === 'production' ? this.time : this.manifest.lastPublished,
                posts: this.postHelpers.mergePostObjectArrays(this.manifest.posts, this.modifiedPosts)
            })
            this.newManifest.posts = this.newManifest.posts.reduce((posts, post) => {
                this.postHelpers.writePost(post, path.join(compiler.outputPath, 'posts'))
                // removing html and markdown before writing to manifest
                delete post.html
                delete post.markdown
                posts.push(post)
                return posts
            }, [])

            this.writeManifest(this.newManifest)
        })
    }
}

module.exports = PostManifest
