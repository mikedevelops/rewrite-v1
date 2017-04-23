import React, { Component } from 'react'
import Post from 'Components/Post'
import { apiGet } from 'Helpers/api.helper'

export default class PostHoc extends Component {
    constructor () {
        super()
        this.state = {}
    }

    componentWillMount () {
        this.getPost()
    }

    /**
     * Get post data from API
     */
    getPost () {
        apiGet(this.props.match.url.slice(1))
        .then(post => {
            this.setState({ post: JSON.parse(post) })
        })
        .catch(err => {
            throw new Error('unable to get post -> ' + err)
        })
    }

    render () {
        return (
            <div className="hoc">
            {
                this.state.post
                ? <Post
                    title={this.state.post.meta.title}
                    date={this.state.post.meta.date}
                    author={this.state.post.meta.author}
                    html={this.state.post.html}
                />
                : <pre className="loading">loading...</pre>
            }
            </div>
        )
    }
}
