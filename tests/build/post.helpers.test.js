const { describe, it, beforeEach } = require('mocha')
const { expect } = require('chai')
const PostHelpers = require('../../build/post.helpers')
const proxyquire = require('proxyquire')
const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')

describe('build post helpers', () => {
    const postRaw = `---\ntitle: foo\nauthor: bar\nlead: foo\n...`
    let postDir
    let post
    let postHelpersStub

    beforeEach(() => {
        postDir = path.join(__dirname, 'posts')
        rimraf.sync(postDir)
        fs.mkdirSync(postDir)
        fs.writeFileSync(path.join(postDir, 'foo.md'), postRaw, 'utf-8')
        post = fs.readFileSync(path.join(postDir, 'foo.md'), 'utf-8')
        postHelpersStub = proxyquire('../../build/PostHelpers', {
            'md5': _ => 'foo'
        })
    })

    after(() => {
        rimraf.sync(postDir)
    })

    describe('createPostObject()', () => {
        const time = Date.now()
        const postObject = {
            title: 'foo',
            author: 'bar',
            id: 'foo',
            lead: 'foo',
            createdAt: time,
            lastModified: time,
            html: '',
            archived: false,
            markdown: ''
        }

        it('should return a post object', () => {
            expect(postHelpersStub.createPostObject(post, time)).to.deep.equal(postObject)
        })
    })

    describe('createPostId()', () => {
        it('should create a post ID', () => {
            expect(postHelpersStub.createPostId('foo', new Date())).to.equal('foo')
        })
    })

    describe('createPostSlug()', () => {
        it('should create a post ID', () => {
            expect(PostHelpers.createPostSlug('foo bar')).to.equal('foo-bar')
            expect(PostHelpers.createPostSlug('foo, bar')).to.equal('foo-bar')
            expect(PostHelpers.createPostSlug('foo bar baz')).to.equal('foo-bar-baz')
        })
    })
})
