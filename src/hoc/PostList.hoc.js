import React, { Component } from 'react'
import PostList from 'Components/PostList'
import { apiGet } from 'Helpers/api.helper'

export default class PostListHoc extends Component {
    constructor () {
        super()
        this.state = {}
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
        apiGet('posts')
            .then(posts => {
                this.setState({ posts: JSON.parse(posts) })
            })
            .catch(err => {
                throw new Error('could not get posts -> ' + err)
            })
    }

    render () {
        return (
            <div className="hoc">
            {
                this.state.posts
                ? <PostList posts={this.state.posts}/>
                : <pre className="loading">loading...</pre>
            }
            </div>
        )
    }
}
