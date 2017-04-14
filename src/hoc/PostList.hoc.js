import React, { Component } from 'react'
import PostList from 'Components/PostList'
import { apiGet } from 'Helpers/api.helper'

export default class PostListHoc extends Component {
    constructor () {
        super()
        this.state = {
            loading: true
        }
    }

    /**
     * Update if the loading state has changed
     * @param  {Object} props
     * @param  {Object} state
     * @return {Boolean}
     */
    componentWillUpdate (props, state) {
        return this.state.loading !== state.loading
    }

    /**
     * Get posts on mount
     */
    componentWillMount () {
        this.getPosts()
    }

    /**
     * Send request to server for posts
     * @return {Array} posts
     */
    getPosts () {
        return apiGet('posts')
        .then(posts => {
            this.posts = JSON.parse(posts)
            this.setState({ loading: false })
        })
        .catch(err => {
            throw new Error('could not get posts -> ' + err)
        })
    }

    render () {
        return (
            <div className="hoc">
            {
                this.state.loading
                ? <pre>loading...</pre>
                : <PostList posts={this.posts}/>
            }
            </div>
        )
    }
}
