import React, { Component } from 'react'
import PostListHoc from 'Hoc/PostList.hoc'

export default class App extends Component {
    render () {
        return (
            <div className="app">
                <pre>React Markdown blog</pre>
                <hr/>
                <PostListHoc/>
            </div>
        )
    }
}
