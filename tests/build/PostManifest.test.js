const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const PostManifest = require('../../build/PostManifest')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const proxyquire = require('proxyquire')

describe('PostManifest', () => {
    let postManifest
    let manifest
    let postDir
    let compiler
    const testPost = `---\ntitle: foo\nauthor: bar\nlead: baz\n...`
    const time = new Date(2017, 4, 15)
    const vanillaManifest = {
        createdAt: time,
        lastPublished: time,
        app: '0.0.0',
        version: '0.0.0',
        posts: []
    }

    beforeEach(() => {
        postDir = path.join(__dirname, 'posts')
        fs.mkdirSync(postDir)
        fs.writeFileSync(path.join(postDir, '13-5-2017-foo.md'), testPost, 'utf-8')
        manifest = path.join(postDir, 'post-manifest.json')
        compiler = { plugin: (foo, next) => next(), outputPath: postDir }
    })

    afterEach(() => {
        rimraf.sync(postDir)
    })

    describe('getBlankManifest()', () => {
        beforeEach(() => {
            postManifest = new PostManifest({ manifest, posts: postDir }, time, '0.0.0')
        })

        it('should return a vanilla manifest', () => {
            expect(postManifest.getBlankManifest()).to.deep.equal(vanillaManifest)
        })
    })

    describe('getManifest()', () => {
        beforeEach(() => {
            postManifest = new PostManifest({ manifest, posts: postDir }, time, '0.0.0')
        })

        it('should return the manifest if one exists', () => {
            fs.writeFileSync(path.join(postDir, 'post-manifest.json'), JSON.stringify({ foo: 'bar' }), 'utf-8')
            expect(postManifest.getManifest().foo).to.equal('bar')
            fs.unlinkSync(path.join(postDir, 'post-manifest.json'))
        })

        it('should return a blank manifest if a manifest does not exist', () => {
            expect(postManifest.getManifest()).to.deep.equal(vanillaManifest)
        })
    })

    describe('getModifiedPosts()', () => {
        it('should return posts that have been created since the last manifest was published', () => {
            const Stub = proxyquire('../../build/postManifest', {
                './post.helpers': {
                    createPostObject: (post, file) => ({
                        createdAt: Date.now()
                    })
                }
            })
            const stubbedManifest = new Stub({ posts: postDir, manifest }, time, '0.0.0')

            stubbedManifest.apply(compiler)
            expect(stubbedManifest.modifiedPosts.length).to.equal(1)
        })

        it('should ignore posts that have not been created since the last manifest was published', () => {
            const Stub = proxyquire('../../build/postManifest', {
                './post.helpers': {
                    createPostObject: (post, file) => ({
                        file: '13-5-2017-foo.md',
                        createdAt: new Date(1990)
                    })
                },
                'fs': {
                    statSync: () => ({
                        mtime: new Date(1990)
                    })
                }
            })
            const stubbedManifest = new Stub({ posts: postDir, manifest }, time, '0.0.0')

            stubbedManifest.manifest.posts.push({ file: '13-5-2017-foo.md' })
            stubbedManifest.apply(compiler)
            expect(stubbedManifest.modifiedPosts.length).to.equal(0)
        })
    })

    describe('writeManifest()', () => {
        it('should write the new manifest to file', () => {
            const Stub = proxyquire('../../build/PostManifest', {
                'fs': {
                    statSync: () => ({
                        mtime: 0
                    })
                }
            })

            postManifest = new Stub({ posts: postDir, manifest }, time, '0.0.0')
            postManifest.writeManifest({ foo: 'bar' })

            const writtenManifest = JSON.parse(fs.readFileSync(manifest, 'utf-8'))

            expect(writtenManifest.foo).to.equal('bar')
        })
    })

    describe('bumpManifestVersion()', () => {
        beforeEach(() => {
            postManifest = new PostManifest({ posts: postDir, manifest }, new Date(), '0.0.0')
        })

        it('should bump the manifest minor version for a new release', () => {
            expect(postManifest.bumpManifestVersion('production')).to.equal('0.1.0')
        })

        it('should bump the manifest major version and reset minor & bug for a new app version', () => {
            const newVersion = new PostManifest({ posts: postDir, manifest }, new Date(), '1.0.0')

            expect(newVersion.bumpManifestVersion()).to.equal('1.0.0')
        })
    })

    describe('apply()', () => {
        it('should create a manifest for the first time with a post', () => {
            const time = new Date()
            const post = {
                id: 'stub',
                title: 'foo',
                author: 'bar',
                lead: '',
                createdAt: 'stub',
                lastModified: 'stub',
                archived: false
            }
            const Stub = proxyquire('../../build/PostManifest', {
                './post.helpers': { createPostObject: () => post }
            })
            const manifest = new Stub({
                posts: postDir,
                manifest: path.join(postDir, 'post-manifest.json')
            }, time, '0.0.0', 'production')
            const expected = JSON.stringify({
                createdAt: time,
                lastPublished: time,
                app: '0.0.0',
                version: '0.1.0',
                posts: [post]
            })

            manifest.apply(compiler)

            const actual = JSON.parse(fs.readFileSync(path.join(postDir, 'post-manifest.json'), 'utf-8'))

            expect(actual).to.deep.equal(JSON.parse(expected))
        })

        it('should add a new post to an existing manifest', () => {
            const firstManifest = {
                'createdAt': time,
                'lastPublished': time,
                'app': '0.0.0',
                'version': '0.0.0',
                'posts': [
                    { 'id': '13-5-2017-foo.md', 'title': '12-5-2017-foo.md', 'createdAt': new Date(2017, 4, 16) }
                ]
            }

            fs.writeFileSync(path.join(postDir, 'bar.md'), testPost, 'utf-8')
            fs.writeFileSync(path.join(postDir, 'post-manifest.json'), JSON.stringify(firstManifest), 'utf-8')

            const Stub = proxyquire('../../build/PostManifest', {
                './post.helpers': {
                    createPostObject: (title) => ({
                        title,
                        createdAt: new Date(2017, 4, 16),
                        id: title
                    })
                }
            })
            const existingManifest = new Stub({ posts: postDir, manifest }, new Date(2017, 4, 15), '0.0.0', 'production')
            const secondManifest = Object.assign({}, firstManifest, {
                version: '0.1.0',
                posts: [
                    { 'id': '13-5-2017-foo.md', 'title': '13-5-2017-foo.md', 'createdAt': new Date(2017, 4, 16) },
                    { 'id': 'bar.md', 'title': 'bar.md', 'createdAt': new Date(2017, 4, 16) }
                ]
            })

            existingManifest.apply(compiler)

            const newManifest = fs.readFileSync(path.join(postDir, 'post-manifest.json'))

            expect(JSON.parse(newManifest)).to.deep.equal(JSON.parse(JSON.stringify(secondManifest)))
        })
    })
    it('should modify an existing post if it has been updated', () => {
        const manifestPublishDate = new Date(2017, 4, 1)

        const updatedPost = `---\ntitle: foo\nauthor: bar\nlead: baz\n...`
        const firstManifest = {
            'createdAt': manifestPublishDate,
            'lastPublished': manifestPublishDate,
            'app': '0.0.0',
            'version': '0.0.0',
            'posts': [
                {
                    file: '13-5-2017-foo.md',
                    id: '13-5-2017-foo.md',
                    title: 'Hello, World!',
                    createdAt: manifestPublishDate,
                    lastModified: manifestPublishDate
                }
            ]
        }

        fs.writeFileSync(path.join(postDir, 'post-manifest.json'), JSON.stringify(firstManifest), 'utf-8')
        fs.writeFileSync(path.join(postDir, '13-5-2017-foo.md'), updatedPost, 'utf-8')

        const Stub = proxyquire('../../build/PostManifest', {
            './post.helpers': {
                createPostObject: (title) => ({
                    file: '13-5-2017-foo.md',
                    createdAt: manifestPublishDate,
                    id: '13-5-2017-foo.md',
                    title: 'Goodbye, World!'
                })
            }
        })
        const existingManifest = new Stub({ posts: postDir, manifest }, manifestPublishDate, '0.0.0', 'production')
        const newManifest = Object.assign({}, firstManifest, {
            version: '0.1.0',
            posts: [
                {
                    file: '13-5-2017-foo.md',
                    createdAt: manifestPublishDate,
                    id: '13-5-2017-foo.md',
                    title: 'Goodbye, World!',
                    lastModified: manifestPublishDate
                }
            ]
        })

        existingManifest.apply(compiler)

        const actual = JSON.parse(fs.readFileSync(path.join(postDir, 'post-manifest.json'), 'utf-8'))

        expect(actual).to.deep.equal(JSON.parse(JSON.stringify(newManifest)))
    })

    // todo - env related code
})
