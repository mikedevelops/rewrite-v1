import React, { Component } from 'react'
import PostListHoc from 'Hoc/PostList.hoc'
import { Link } from 'react-router-dom'

export default class App extends Component {
    render () {
        return (
            <div className="app">
                <Link to="/">React Markdown blog</Link>
                <hr/>
                <PostListHoc/>
            </div>
        )
    }
}
