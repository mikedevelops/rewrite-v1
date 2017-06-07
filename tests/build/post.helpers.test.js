require('jest')

const postHelpers = require('../../build/post.helpers')
const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')

// Stubbed Hash class
class Hasher {
    encode () {
        return 'hasher'
    }
}

describe('build post helpers', () => {
    const postRaw = `---\ntitle: foo\nauthor: bar\nlead: foo\n...`
    let postDir
    let post

    beforeEach(() => {
        postDir = path.join(__dirname, 'posts')
        rimraf.sync(postDir)
        fs.mkdirSync(postDir)
        fs.writeFileSync(path.join(postDir, '14-5-2017-foo.md'), postRaw, 'utf-8')
        post = fs.readFileSync(path.join(postDir, '14-5-2017-foo.md'), 'utf-8')
    })

    afterEach(() => {
        rimraf.sync(postDir)
    })

    describe('createPostObject()', () => {
        const time = new Date(2017, 4, 14)
        const postObject = {
            title: 'foo',
            author: 'bar',
            file: '14-5-2017-foo.md',
            id: 'foo-hasher',
            lead: 'foo',
            createdAt: time,
            lastModified: time,
            html: '',
            archived: false,
            markdown: '',
            slug: 'foo-hasher'
        }

        test('should return a post object', () => {
            expect(postHelpers.createPostObject(
                '14-5-2017-foo.md',
                post,
                postHelpers.createPostSlug,
                postHelpers.createPostId,
                postHelpers.getPostDate,
                new Hasher()
            )).toEqual(postObject)
        })
    })

    describe('createPostId()', () => {
        test('should create a post ID', () => {
            expect(postHelpers.createPostId('foo')).toBe('foo')
        })
    })

    describe('createPostSlug()', () => {
        test('should create a post slug', () => {
            expect(postHelpers.createPostSlug('foo bar', new Hasher())).toBe('foo-bar-hasher')
            expect(postHelpers.createPostSlug('foo, bar', new Hasher())).toBe('foo-bar-hasher')
            expect(postHelpers.createPostSlug('foo bar baz', new Hasher())).toBe('foo-bar-baz-hasher')
        })
    })

    describe('mergePostObjectArrays()', () => {
        const oldPosts = [{ id: 0, title: 'foo' }, { id: 1, title: 'bar' }, { id: 2, title: 'post' }]
        const newPosts = [{ id: 1, title: 'baz' }, { id: 2, title: 'baz' }]

        test('should merge old posts and modified posts', () => {
            expect(postHelpers.mergePostObjectArrays(oldPosts, newPosts)).toEqual([
                { id: 0, title: 'foo' }, { id: 1, title: 'baz' }, { id: 2, title: 'baz' }
            ])
        })

        test('should handle empty values', () => {
            expect(postHelpers.mergePostObjectArrays([], newPosts)).toEqual(newPosts)
        })
    })

    describe('getPostDate()', () => {
        test('should create a custom date object from a post name', () => {
            const expected = new Date(1988, 9, 3)

            expect(postHelpers.getPostDate('03-10-1988-foo')).toEqual(expected)
            expect(postHelpers.getPostDate('3-10-1988-foo')).toEqual(expected)
        })
    })

    describe('mergePostObjects()', () => {
        test('should merge 2 post objects', () => {
            const oldPost = { id: 'foo', title: 'foo', createdAt: 123 }
            const newPost = { id: 'foo', title: 'bar', createdAt: 123 }

            expect(postHelpers.mergePostObjects(oldPost, newPost)).toEqual(newPost)
        })

        test('should respect read-only properties', () => {
            const oldPost = { id: 'foo', title: 'foo', createdAt: 123 }
            const newPost = { id: 'bar', title: 'bar', createdAt: 456 }

            expect(postHelpers.mergePostObjects(oldPost, newPost)).toEqual({
                id: 'foo', title: 'bar', createdAt: 123
            })
        })

        test('should update last modified', () => {
            const time = new Date()
            const oldPost = { id: 'foo', title: 'foo', createdAt: 123, lastModified: 123 }
            const newPost = { id: 'bar', title: 'bar', createdAt: 456 }

            expect(postHelpers.mergePostObjects(oldPost, newPost, time)).toEqual({
                id: 'foo', title: 'bar', createdAt: 123, lastModified: time
            })
        })
    })

    describe('writePost()', () => {
        test('should write a post to file', () => {
            const postObject = {
                id: 'foo',
                title: 'foo',
                content: 'foo'
            }

            postHelpers.writePost(postObject, postDir)

            const post = JSON.parse(fs.readFileSync(path.join(postDir, 'foo.json'), 'utf-8'))

            expect(post).toEqual(postObject)
        })
    })
})
