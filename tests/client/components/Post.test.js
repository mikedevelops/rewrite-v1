require('mocha')
require('chai')

const React = require('react')
const { shallow } = require('enzyme')
const Post = require('Components/Post')
const postData = {
    title: 'foo',
    author: 'foo',
    createdAt: 'foo',
    content: '<h1>post</h1>'
}

describe('<Post/>', () => {
    const { title, author, date, content } = postData
    const post = shallow(
        <Post
            title={title}
            author={author}
            date={date}
            html={content}/>)

    it('should render a title', () => {
        expect(post.contains(
            <h1 className="post__title">{ title }</h1>
        )).to.be.true
    })

    it('should render a createdAt element', () => {
        expect(post.contains(
            <p className="post__created-at">{ date }</p>
        )).to.be.true
    })

    it('should render an author element', () => {
        expect(post.contains(
            <p className="post__author">{ author }</p>
        )).to.be.true
    })

    it('should render a content element', () => {
        const expected = '<div class="post__content markdown"><h1>post</h1></div>'
        expect(post.find('.post__content').html()).to.equal(expected)
    })
})
