import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from 'Helpers/date.helper'

export function getPostUri (title) {
    return title.replace(' ', '-')
}

export function PostListing ({ title, author, date, post, id }) {
    return (
        <div className="post-listing">
            <Link
                className="post-listing__link"
                to={`post/${id}/${getPostUri(title)}`}>
                <h2 className="post-listing__title">{ title }</h2>
                <div className="post-listing__meta">
                    <p className="post-listing__date">
                        { formatDate(date, 'smart') }
                    </p>
                    <p className="post-listing__author">{ author }</p>
                </div>
            </Link>
            <hr/>
        </div>
    )
}

export default class PostList extends Component {
    printPosts () {
        return this.props.posts.map(post => {
            return <PostListing
                key={post.date}
                id={post.id}
                title={post.title}
                author={post.author}
                date={post.date}
                post={post.post}/>
        })
    }

    render () {
        return <div className="post-list">{ this.printPosts() }</div>
    }
}
