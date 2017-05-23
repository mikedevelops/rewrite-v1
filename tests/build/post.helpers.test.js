const { describe, it, beforeEach } = require('mocha')
const { expect } = require('chai')
const postHelpers = require('../../build/post.helpers')
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
        fs.writeFileSync(path.join(postDir, '14-5-2017-foo.md'), postRaw, 'utf-8')
        post = fs.readFileSync(path.join(postDir, '14-5-2017-foo.md'), 'utf-8')
        postHelpersStub = proxyquire('../../build/post.helpers', {
            'hashids': class {
                encode () {
                    return 'hashid'
                }
            }
        })
    })

    after(() => {
        rimraf.sync(postDir)
    })

    describe('createPostObject()', () => {
        const time = new Date(2017, 4, 14)
        const postObject = {
            title: 'foo',
            author: 'bar',
            file: '14-5-2017-foo.md',
            id: 'foo-hashid',
            lead: 'foo',
            createdAt: time,
            lastModified: 'v2',
            html: '',
            archived: false,
            markdown: '',
            slug: 'foo-hashid'
        }

        it('should return a post object', () => {
            expect(postHelpersStub.createPostObject('14-5-2017-foo.md', post)).to.deep.equal(postObject)
        })
    })

    describe('createPostId()', () => {
        it('should create a post ID', () => {
            expect(postHelpersStub.createPostId('foo')).to.equal('foo')
        })
    })

    describe('createPostSlug()', () => {
        it('should create a post slug', () => {
            expect(postHelpersStub.createPostSlug('foo bar')).to.equal('foo-bar-hashid')
            expect(postHelpersStub.createPostSlug('foo, bar')).to.equal('foo-bar-hashid')
            expect(postHelpersStub.createPostSlug('foo bar baz')).to.equal('foo-bar-baz-hashid')
        })
    })

    describe('mergePostObjectArrays()', () => {
        const oldPosts = [{ id: 0, title: 'foo' }, { id: 1, title: 'bar'}, { id: 2, title: 'post' }]
        const newPosts = [{ id: 1, title: 'baz'}, { id: 2, title: 'baz' }]

        it('should merge old posts and modified posts', () => {
            expect(postHelpers.mergePostObjectArrays(oldPosts, newPosts)).to.deep.equal([
                { id: 0, title: 'foo' }, { id: 1, title: 'baz' }, { id: 2, title: 'baz' }
            ])
        })

        it('should handle empty values', () => {
            expect(postHelpers.mergePostObjectArrays([], newPosts)).to.deep.equal(newPosts)
        })
    })

    describe('getPostDate()', () => {
        it('should create a custom date object from a post name', () => {
            const expected = new Date(1988, 3, 3)

            expect(postHelpers.getPostDate('03-04-1988-foo')).to.deep.equal(expected)
            expect(postHelpers.getPostDate('3-4-1988-foo')).to.deep.equal(expected)
        })
    })

    describe('mergePostObjects()', () => {
        it('should merge 2 post objects', () => {
            const oldPost = { id: 'foo', title: 'foo', createdAt: 123 }
            const newPost = { id: 'foo', title: 'bar', createdAt: 123 }

            expect(postHelpers.mergePostObjects(oldPost, newPost)).to.deep.equal(newPost)
        })

        it('should respect read-only properties', () => {
            const oldPost = { id: 'foo', title: 'foo', createdAt: 123 }
            const newPost = { id: 'bar', title: 'bar', createdAt: 456 }

            expect(postHelpers.mergePostObjects(oldPost, newPost)).to.deep.equal({
                id: 'foo', title: 'bar', createdAt: 123
            })
        })

        it('should update last modified', () => {
            const time = new Date()
            const oldPost = { id: 'foo', title: 'foo', createdAt: 123, lastModified: 123 }
            const newPost = { id: 'bar', title: 'bar', createdAt: 456 }

            expect(postHelpers.mergePostObjects(oldPost, newPost, time)).to.deep.equal({
                id: 'foo', title: 'bar', createdAt: 123, lastModified: time
            })
        })
    })

    describe('writePost()', () => {
        it('should write a post to file', () => {
            const postObject = {
                id: 'foo',
                title: 'foo',
                content: 'foo'
            }

            postHelpers.writePost(postObject, postDir)

            const post = JSON.parse(fs.readFileSync(path.join(postDir, 'foo.json'), 'utf-8'))

            expect(post).to.deep.equal(postObject)
        })
    })
})
