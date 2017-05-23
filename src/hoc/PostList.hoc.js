import React, { Component } from 'react'
import PostList from 'Components/PostList'
import { apiGET } from 'Helpers/api.helper'

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
        apiGET('posts')
            .then(posts => {
                const parsedPosts = JSON.parse(posts, (key, value) => {
                    if (key === 'createdAt') {
                        return new Date(value)
                    } else {
                        return value
                    }
                })

                this.setState({ posts: parsedPosts })
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
