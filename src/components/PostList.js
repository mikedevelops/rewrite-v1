import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from 'Utils/date.utils'

export function PostListing ({ title, author, createdAt, id, slug }) {
    return (
        <div className="post-listing" key={id}>
            <Link
                className="post-listing__link"
                to={`/post/${id}`}>
                <h2 className="post-listing__title">{ title }</h2>
                <div className="post-listing__meta">
                    <p className="post-listing__date">
                        { formatDate(createdAt, 'smart') }
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
                key={post.id}
                id={post.id}
                title={post.title}
                author={post.author}
                createdAt={post.createdAt}
                slug={post.slug}
            />
        })
    }

    render () {
        return <div className="post-list">{ this.printPosts() }</div>
    }
}
