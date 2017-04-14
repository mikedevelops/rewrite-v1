import React from 'react'

export default function Post ({ title, date, author, content }) {
    const html = { __html: content }
    return (
        <div className="post">
            <h1 className="post__title">{ title }</h1>
            <div className="post__meta">
                <p className="post__created-at">{ date }</p>
                <p className="post__author">{ author }</p>
            </div>
            <div
                className="post__content markdown"
                dangerouslySetInnerHTML={html}
            />
        </div>
    )
}
