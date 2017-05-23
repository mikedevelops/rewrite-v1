import React, { Component } from 'react'
import Post from 'Components/Post'
import { apiGET } from 'Helpers/api.helper'
import { request } from 'Helpers/xhr.helper'
import { Redirect } from 'react-router-dom'

export default class PostHoc extends Component {
    constructor (props) {
        super(props)
        this.state = {}
        this.slugged = false
        this.getPost(props.match.params.id)
    }

    componentWillReceiveProps (props) {
        this.getPost(props.match.params.id)
    }

    /**
     * Get post data from API
     */
    getPost (id) {
        return request(`posts/${id}.json`)
            .then(post => {
                this.setState({ post: JSON.parse(post) })
            })
    }

    render () {
        return (
            <div className="hoc">
            {
                this.state.post
                    ? <Post
                        title={this.state.post.title}
                        date={this.state.post.date}
                        author={this.state.post.author}
                        html={this.state.post.html}/>
                    : <pre>loading...</pre>
            }
            </div>
        )
    }
}
