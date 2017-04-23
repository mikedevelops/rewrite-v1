import React from 'react'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from 'sinon'
import PostListHoc from 'Hoc/PostList.hoc'
import PostList from 'Components/PostList'

describe('<PostListHoc/>', () => {
    let getPosts
    let postList
    let hoc

    beforeEach(() => {
        getPosts = stub(PostListHoc.prototype, 'getPosts').callsFake(() => null)
        postList = stub(PostList.prototype, 'render').callsFake(() => null)
        hoc = shallow(<PostListHoc/>)
    })

    afterEach(() => {
        getPosts.restore()
        postList.restore()
    })

    it('should initiate with a loading state', () => {
        expect(hoc.find('.loading').length).to.equal(1)
    })

    it('should call getPosts on when mounted', () => {
        expect(getPosts.calledOnce).to.be.true
    })

    it('should render a post list', () => {
        hoc.setState({ posts: ['foo'] })
        expect(hoc.text()).to.equal('<PostList />')
    })
})
