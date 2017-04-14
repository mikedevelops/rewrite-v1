import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from 'Components/App'
import PostHoc from 'Hoc/Post.hoc'

// TODO
// - Create post component
// - Create post list component w/ load-more / infinite load

render(
    <Router>
        <div>
            <Route path="/" component={App}/>
            <Route path="/post/:id/:post" component={PostHoc}/>
        </div>
    </Router>,
    document.getElementById('app')
)
