const { describe, it, before, beforeEach } = require('mocha')
const { expect } = require('chai')
const { spy, stub } = require('sinon')
const BuildPosts = require('../../build/BuildPosts')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const proxyquire = require('proxyquire')

describe('BuildPosts', () => {
    const postRaw = `---\ntitle: foo\nauthor: bar\ndate: 1492498837010\n...`
    const postData = { title: 'foo', author: 'bar', date: 1492498837010 }
    let fakePostDir
    let buildPosts

    beforeEach(() => {
        fakePostDir = path.join(__dirname, 'posts')
        fs.mkdirSync(fakePostDir)
        fs.writeFileSync(path.join(fakePostDir, 'foo.md'), postRaw, 'utf-8')
    })

    afterEach(() => {
        rimraf.sync(fakePostDir)
    })

    describe('filterUnique()', () => {
        const manifest = { posts: [{ title: 'foo', author: 'bar', date: 1324 }] }

        beforeEach(() => {
            buildPosts = new BuildPosts()
            buildPosts.fileManifest = manifest
        })

        it('should return a unique post', () => {
            const post = { title: 'bar', author: 'bar', date: 123 }

            expect(buildPosts.filterUnique(post)).to.equal(true)
        })

        it('should not return a post that is in the manifest', () => {
            const post = { title: 'foo', author: 'bar', date: 1324 }

            expect(buildPosts.filterUnique(post)).to.equal(false)
        })

        it('should return a post if there is nothing in the file manifest', () => {
            const post = { title: 'foo', author: 'bar', date: 1324 }

            buildPosts.fileManifest = { posts: [] }
            expect(buildPosts.filterUnique(post)).to.equal(true)
        })
    })

    describe('createManifestEntry()', () => {
        before(() => {
            const stub = proxyquire('../../build/BuildPosts', {
                'shortid': {
                    'generate': function () { return 'foo' }
                }
            })

            buildPosts = new stub()
        })

        it('should validate the post title', () => {
            const noTitle = Object.assign({}, postData, { title: '' })

            expect(buildPosts.createManifestEntry.bind(this, noTitle)).to.throw(Error)
        })

        it('should validate the post author', () => {
            const noAuthor = Object.assign({}, postData, { author: '' })

            expect(buildPosts.createManifestEntry.bind(this, noAuthor)).to.throw(Error)
        })

        it('should validate the post title', () => {
            const noDate = Object.assign({}, postData, { date: 0 })

            expect(buildPosts.createManifestEntry.bind(this, noDate)).to.throw(Error)
        })

        it('should create an ID for a post', () => {
            const post = { title: 'bar', author: 'bar', date: 123 }

            buildPosts.memManifest = []
            buildPosts.createManifestEntry(post)
            expect(buildPosts.memManifest[0]._id).to.equal('foo')
        })
    })

    describe('createManifestTimestamp()', () => {
        it('should return a timestamp', () => {
            expect(BuildPosts.createManifestTimestamp()).to.be.a('Date')
        })
    })

    describe('writeManifestToFile()', () => {
        beforeEach(() => {
            stub(BuildPosts, 'createManifestTimestamp').returns(123)
            buildPosts = new BuildPosts({ src: fakePostDir })
        })

        afterEach(() => {
            BuildPosts.createManifestTimestamp.restore()
        })

        it('should create a manifest file if one does not exist', () => {
            const post = { title: 'bar', author: 'bar', date: 123, _id: 'foo' }
            const expected = { createdAt: 123, posts: [post], version: '1.0.0' }

            buildPosts.memManifest = [post]
            buildPosts.writeManifestToFile()
            expect(JSON.parse(fs.readFileSync(path.join(fakePostDir, 'post-manifest.json'), 'utf-8')))
                .to.deep.equal(expected)
        })

        it('should update an existing manifest file', () => {
            const post = { title: 'bar', author: 'bar', date: 123, _id: 'foo' }
            const newPost = { title: 'foo', author: 'foo', date: 456, _id: 'bar' }
            const expected = { createdAt: 123, posts: [post, newPost], version: '1.0.0' }

            fs.writeFileSync(path.join(fakePostDir, 'post-manifest.json'), JSON.stringify(post), 'utf-8')
            buildPosts.fileManifest = { posts: [post] }
            buildPosts.memManifest = [newPost]
            buildPosts.writeManifestToFile()
            expect(JSON.parse(fs.readFileSync(path.join(fakePostDir, 'post-manifest.json'), 'utf-8')))
                .to.deep.equal(expected)
        })

        it('should add a createdAt property to the manifest', () => {
            const post = { title: 'bar', author: 'bar', date: 123, _id: 'foo' }
            const expected = { createdAt: 123, posts: [post], version: '1.0.0' }

            buildPosts.memManifest = [post]
            buildPosts.writeManifestToFile()
            expect(JSON.parse(fs.readFileSync(path.join(fakePostDir, 'post-manifest.json'), 'utf-8')))
                .to.deep.equal(expected)
        })
    })

    describe('build()', () => {
        let buildCallback = spy()

        before(() => {
            buildPosts = new BuildPosts({ src: fakePostDir })
        })

        it('should write posts to a post manifest', () => {
            const expected = [{ title: 'foo', author: 'bar', date: 1492498837010 }]
            const stubbedCompiler = {}

            buildPosts.memManifest = expected
            buildPosts.build(stubbedCompiler, buildCallback)

            const manifest = fs.readFileSync(path.join(fakePostDir, 'post-manifest.json'), 'utf-8')

            expect(JSON.parse(manifest).posts).to.deep.equal(expected)
        })
    })

    describe('getManifestVersion()', () => {
        beforeEach(() => {
            buildPosts = new BuildPosts({ src: fakePostDir })
        })

        afterEach(() => {
            process.env.NODE_ENV = 'test'
        })

        it('should return 0.0.0 for a new manifest', () => {
            expect(buildPosts.getManifestVersion()).to.equal('1.0.0')
        })

        it('should increment the manifest minor number in production', () => {
            buildPosts.fileManifest.version = '1.0.0'
            process.env.NODE_ENV = 'production'
            expect(buildPosts.getManifestVersion()).to.equal('1.1.0')
        })

        it('should not increment the version when not in production', () => {
            buildPosts.fileManifest.version = '1.1.0'
            expect(buildPosts.getManifestVersion()).to.equal('1.1.0')
        })
    })
})
