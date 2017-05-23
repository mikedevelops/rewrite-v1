import React from 'react'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from 'sinon'

import PostHoc from 'Hoc/Post.hoc'
import Post from 'Components/Post'

describe('<PostHoc/>', () => {
    const fakePost = { meta: { title: 'foo', date: 123, author: 'bar' }, html: '' }
    let getPost
    let post
    let hoc

    beforeEach(() => {
        getPost = stub(PostHoc.prototype, 'getPost').callsFake(() => null)
        post = stub(Post.prototype, 'render').callsFake(() => null)
        hoc = shallow(<PostHoc/>)
    })

    afterEach(() => {
        getPost.restore()
    })

    it('should initiate with a loading state', () => {
        expect(hoc.find('.loading').length).to.equal(1)
    })

    it('should apiGET a post when mounted', () => {
        expect(getPost.calledOnce).to.be.true
    })

    it('should render a post', () => {
        hoc.setState({ post: fakePost })
        expect(hoc.text()).to.equal('<Post />')
    })
})
