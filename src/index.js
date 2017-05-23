import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'

import App from 'Components/App'
import PostHoc from 'Hoc/Post.hoc'

// TODO
// - Create post component
// - Create post list component w/ load-more / infinite load

render(
    <HashRouter>
        <div>
            <Route path="/" component={App}/>
            <Route path="/post/:id" component={PostHoc}/>
        </div>
    </HashRouter>,
    document.getElementById('app')
)
