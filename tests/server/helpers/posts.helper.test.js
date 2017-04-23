const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const postHelpers = require('../../../server/helpers/posts.helper')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const post = [
    '---\nid: 1\ntitle: foo\nauthor: bar\ndate: 1491061453895\n...',
    '---\nid: 2\ntitle: bar\nauthor: foo\ndate: 1491061453895\n...'
]

describe('Post helpers', () => {
    const testPosts = path.join(__dirname, 'posts')

    before(() => {
        fs.mkdirSync(testPosts)
        fs.writeFileSync(path.join(testPosts, '/foo.md'), post[0], 'utf-8')
        fs.writeFileSync(path.join(testPosts, '/bar.md'), post[1], 'utf-8')
        fs.writeFileSync(path.join(testPosts, '/foo.json'), post[1], 'utf-8')
        fs.writeFileSync(path.join(testPosts, '/bar.js'), post[1], 'utf-8')
    })

    after(() => {
        rimraf.sync(testPosts)
    })

    describe('getAllPosts()', () => {
        it('should return an array of posts metadata', () => {
            const expected = [
                { id: 2, title: 'bar', author: 'foo', date: 1491061453895 },
                { id: 1, title: 'foo', author: 'bar', date: 1491061453895 }
            ]

            expect(postHelpers.getAllPosts(testPosts)).to.deep.equal(expected)
        })

        it('should ignore non-markdown files', () => {
            expect(postHelpers.getAllPosts(testPosts).length).to.equal(2)
        })

        it('should return an array', () => {
            expect(postHelpers.getAllPosts(testPosts)).to.be.instanceof(Array)
        })
    })

    describe('getFullPostData()', () => {
        it('should return a full post data object', () => {
            const expected = {
                meta: {
                    id: 1,
                    title: 'foo',
                    author: 'bar',
                    date: 1491061453895
                },
                html: ''
            }

            expect(postHelpers.getFullPostDataObject(testPosts, 'foo.md')).to.deep.equal(expected)
        })
    })

    describe('getPostId()', () => {
        it('should return the post id stored in the post filename')
    })

    describe('getPostById()', () => {
        it('should return a full post data object by post id')
    })
})
