const express = require('express')
const path = require('path')
const cors = require('cors')
const winston = require('winston')
const { getAllPosts, getPostById } = require('./server/helpers/posts.helper')

const app = express()
const PORT = process.env.PORT || 3000
const assets = path.join(__dirname, 'www')
const postsDirectory = path.join(__dirname, 'posts')

// set logging level
winston.level = process.env.LOGGING || 'info'

app.use(cors())
app.use(express.static(assets))

app.get('/', (req, res) => {
    res.sendFile(path.join(assets, 'index.html'))
})

app.get('/api/posts', (req, res) => {
    const posts = getAllPosts(postsDirectory)

    // todo
    // - should posts be processed and chucked on the front end as an asset with their filename as their ID
    // - the API could potentially just return the link between processed and unprocessed posts
    // - main problem is _how_ we know an unprocessed post is a processed post
    // - maybe the key is the date? This will _always_ be unique

    winston.log('debug', `returning ${posts.length} post(s)`)
    res.send(posts)
})

app.get('/api/post/:id/:post', (req, res) => {
    const id = parseInt(req.params.id)
    const post = getPostById(postsDirectory, id)

    winston.log('debug', `getting post ID ${id} - ${post.meta.title}`)
    res.send(post)
})

app.listen(PORT, () => {
    winston.log('info', 'server running on ' + PORT)
})
