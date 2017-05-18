const path = require('path')
const fs = require('fs')
const postHelpers = require('./post.helpers')
const utils = require('../utils/version.util')
const defaults = {
    posts: path.resolve(__dirname, '../', 'posts'),
    manifest: path.resolve(__dirname, '../post-manifest.json')
}

// todo - unable to get reliable file creation time in node,
// this is an issue as we need to determine what qualifies as a new file
// if we can't determine what constitutes a new file, we are unable to reliably
// merge new revisions with old posts, there is nothing to indicate (apart from filename)
// that they are the same

class PostManifest {
    constructor (options, date, appVersion, env = 'development') {
        this.env = env
        this.appVersion = appVersion
        this.options = Object.assign({}, defaults, options)
        this.time = date
        this.manifest = this.getManifest()
        this.modifiedPosts = this.getModifiedPosts()
        this.newVersion = this.env === 'production' ? this.bumpManifestVersion() : this.manifest.version
        this.newManifest = Object.assign({}, this.manifest,
            {
                app: appVersion,
                version: this.newVersion,
                lastPublished: this.env === 'production' ? this.time : this.manifest.lastPublished,
                posts: postHelpers.mergePostObjectArrays(this.manifest.posts, this.modifiedPosts)
            }
        )
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
                const postFile = fs.readFileSync(path.join(this.options.posts, post), 'utf-8')
                const { mtime } = fs.statSync(path.join(this.options.posts, post), 'utf-8')
                const existingPost = this.manifest.posts.find(existing => existing.file === post)
                const newPost = postHelpers.createPostObject(post, postFile)

                if (!existingPost) {
                    modPosts.push({
                        id: newPost.id,
                        file: newPost.file,
                        title: newPost.title,
                        author: newPost.author,
                        createdAt: newPost.createdAt,
                        lastModified: newPost.lastModified,
                        archived: newPost.archived,
                        lead: newPost.lead
                    })
                } else if (mtime > Date.parse(this.manifest.lastPublished)) {
                    modPosts.push(postHelpers.mergePostObjects(existingPost, newPost, this.time))
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
     */
    writeManifest () {
        fs.writeFileSync(this.options.manifest, JSON.stringify(this.newManifest, null, 4), 'utf-8')
    }

    /**
     * Webpack apply method for using as a webpack plugin
     * @param {Object} compiler
     */
    apply (compiler) {
        compiler.plugin('done', () => {
            this.newManifest.posts.forEach(post => {
                postHelpers.writePost({
                    id: post.id,
                    createdAt: post.createdAt,
                    lead: post.lead,
                    title: post.title,
                    author: post.author,
                    content: post.html
                }, path.join(compiler.outputPath, 'posts'))
            })

            this.writeManifest()
        })
    }
}

module.exports = PostManifest
