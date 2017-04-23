import React from 'react'

export default function Post ({ title, date, author, html }) {
    const content = { __html: html }
    return (
        <div className="post">
            <h1 className="post__title">{ title }</h1>
            <div className="post__meta">
                <p className="post__created-at">{ date }</p>
                <p className="post__author">{ author }</p>
            </div>
            <div
                className="post__content markdown"
                dangerouslySetInnerHTML={content}
            />
        </div>
    )
}
