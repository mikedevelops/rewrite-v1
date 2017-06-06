const PostManifest = require('../../build/PostManifest')
const postHelpers = require('../../build/post.helpers')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const stubbedPostHelplers = Object.assign({}, postHelpers, {
    createPostObject: (a, b, c, d, e, f) => {
        const hasher = { encode: title => `hash` }
        return postHelpers.createPostObject(a, b, c, d, e, hasher)
    }
})

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
        postManifest = new PostManifest({ manifest, posts: postDir }, time, '0.0.0', 'production', stubbedPostHelplers)
    })

    afterEach(() => {
        rimraf.sync(postDir)
    })

    describe('getBlankManifest()', () => {
        test('should return a vanilla manifest', () => {
            expect(postManifest.getBlankManifest()).toEqual(vanillaManifest)
        })
    })

    describe('getManifest()', () => {
        test('should return the manifest if one exists', () => {
            fs.writeFileSync(path.join(postDir, 'post-manifest.json'), JSON.stringify({ foo: 'bar' }), 'utf-8')
            expect(postManifest.getManifest().foo).toEqual('bar')
            fs.unlinkSync(path.join(postDir, 'post-manifest.json'))
        })

        test('should return a blank manifest if a manifest does not exist', () => {
            expect(postManifest.getManifest()).toEqual(vanillaManifest)
        })
    })

    describe('getModifiedPosts()', () => {
        test('should return posts that have been created since the last manifest was published', () => {
            postManifest.apply(compiler)
            expect(postManifest.modifiedPosts.length).toEqual(1)
        })
    })

    describe('writeManifest()', () => {
        test('should write the new manifest to file', () => {
            postManifest.writeManifest({ foo: 'bar' })

            const writtenManifest = JSON.parse(fs.readFileSync(manifest, 'utf-8'))

            expect(writtenManifest.foo).toEqual('bar')
        })
    })

    describe('bumpManifestVersion()', () => {
        test('should bump the manifest minor version for a new release', () => {
            expect(postManifest.bumpManifestVersion('production')).toEqual('0.1.0')
        })

        test('should bump the manifest major version and reset minor & bug for a new app version', () => {
            const newVersion = new PostManifest({ posts: postDir, manifest }, new Date(), '1.0.0')

            expect(newVersion.bumpManifestVersion()).toEqual('1.0.0')
        })
    })

    describe('apply()', () => {
        test('should create a manifest for the first time with a post', () => {
            const expected = {
                createdAt: '2017-05-15T00:00:00.000Z',
                lastPublished: '2017-05-15T00:00:00.000Z',
                app: '0.0.0',
                version: '0.1.0',
                posts: [{
                    archived: false,
                    author: 'bar',
                    createdAt: '2017-05-13T00:00:00.000Z',
                    file: '13-5-2017-foo.md',
                    id: 'foo-hash',
                    lastModified: 'v2',
                    lead: 'baz',
                    slug: 'foo-hash',
                    title: 'foo'
                }]
            }

            postManifest.apply(compiler)
            expect(JSON.parse(fs.readFileSync(path.join(postDir, 'post-manifest.json'), 'utf-8'))).toEqual(expected)
        })

        test('should add a new post to an existing manifest', () => {
            const newPost = `---\ntitle: new post\nauthor: new author\nlead: new post\n...`

            const expected = {
                createdAt: '2017-05-15T00:00:00.000Z',
                lastPublished: '2017-05-15T00:00:00.000Z',
                app: '0.0.0',
                version: '0.1.0',
                posts: [
                    {
                        archived: false,
                        author: 'bar',
                        createdAt: '2017-05-13T00:00:00.000Z',
                        file: '13-5-2017-foo.md',
                        id: 'foo-hash',
                        lastModified: 'v2',
                        lead: 'baz',
                        slug: 'foo-hash',
                        title: 'foo'
                    },
                    {
                        archived: false,
                        author: 'new author',
                        createdAt: '2017-05-14T00:00:00.000Z',
                        file: '14-5-2017-bar.md',
                        id: 'new-post-hash',
                        lastModified: 'v2',
                        lead: 'new post',
                        slug: 'new-post-hash',
                        title: 'new post'
                    }
                ]
            }

            postManifest.apply(compiler)
            fs.writeFileSync(path.join(postDir, '14-5-2017-bar.md'), newPost, 'utf-8')
            postManifest.apply(compiler)
            expect(JSON.parse(fs.readFileSync(path.join(postDir, 'post-manifest.json'), 'utf-8'))).toEqual(expected)
        })
    })
    test('should modify an existing post if it has been updated', () => {
        // todo - modified date tests
    })

    // todo - env related code
})
