const { describe, it, beforeEach, after } = require('mocha')
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
    const testPost = `---\ntitle: foo\nauthor: bar\ndate: 12345\n...`
    const vanillaManifest = {
        createdAt: 123,
        lastPublished: 123,
        app: '0.0.0',
        version: '1.0.0',
        posts: []
    }

    beforeEach(() => {
        postDir = path.join(__dirname, 'posts')
        rimraf.sync(postDir)
        fs.mkdirSync(postDir)
        fs.writeFileSync(path.join(postDir, 'foo.md'), testPost, 'utf-8')
        fs.writeFileSync(path.join(postDir, 'post-manifest.json'), JSON.stringify(vanillaManifest), 'utf-8')
        manifest = path.join(postDir, 'post-manifest.json')
        postManifest = new PostManifest({ manifest, posts: postDir })
    })

    after(() => {
        rimraf.sync(postDir)
    })

    describe('getBlankManifest()', () => {
        it('should return a vanilla manifest', () => {
            expect(PostManifest.getBlankManifest(123, '0.0.0')).to.deep.equal(vanillaManifest)
        })
    })

    describe('getManifest()', () => {
        it('should return the manifest if one exists', () => {
            expect(postManifest.getManifest(123, '0.0.0')).to.deep.equal(vanillaManifest)
        })

        it('should return false if a manifest does not exist', () => {
            fs.unlinkSync(path.join(postDir, 'post-manifest.json'))
            expect(postManifest.getManifest(123, '0.0.0')).to.deep.equal(vanillaManifest)
        })
    })

    describe('getModifiedPosts()', () => {
        it('should return posts that have been modified since the last manifest was published', () => {
            const Stub = proxyquire('../../build/PostManifest', { 'fs': { 'statSync': () => ({ mtime: 1234 }) } })

            postManifest = new Stub({ posts: postDir, manifest })
            expect(postManifest.getModifiedPosts().length).to.equal(1)
        })

        it('should return all posts if the manifest has not been published', () => {
            const Stub = proxyquire('../../build/PostManifest', { 'fs': { 'statSync': () => ({ mtime: 0 }) } })

            postManifest = new Stub({ posts: postDir, manifest })
            expect(postManifest.getModifiedPosts().length).to.equal(1)
        })

        it('should ignore posts that have not been modified since the last manifest was published', () => {
            const Stub = proxyquire('../../build/PostManifest', { 'fs': { 'statSync': () => ({ mtime: 122 }) } })

            postManifest = new Stub({ posts: postDir, manifest })
            postManifest.manifest.version = '1.1.0'
            expect(postManifest.getModifiedPosts().length).to.equal(0)
        })
    })
})
