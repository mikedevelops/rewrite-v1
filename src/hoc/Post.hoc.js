import React, { Component } from 'react'
import Post from 'Components/Post'
import { request } from 'Helpers/xhr.helper'

export default class PostHoc extends Component {
    constructor () {
        super()
        this.state = {
            loading: true
        }
    }

    componentWillMount () {
        const { match } = this.props
        return request(match.url, 'GET', { 'Content-Type': 'application/json' })
        .then(res => {
            this.post = JSON.parse(res)
            this.setState({ loading: false })
        })
        .catch(err => console.log(err))
    }

    render () {
        const { title, date, author, html } = this.post
        return (
            <div className="hoc">
            {
                this.state.loading
                ? <pre>loading...</pre>
                : <Post
                    title={title}
                    date={date}
                    author={author}
                    html={html}
                />
            }
            </div>
        )
    }
}
