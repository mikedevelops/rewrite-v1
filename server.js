const express = require('express')
const path = require('path')
const cors = require('cors')
const winston = require('winston')
const app = express()
const PORT = process.env.PORT || 3000
const assets = path.join(__dirname, 'www')

const manifest = require('./post-manifest')

// set logging level
winston.level = process.env.LOGGING || 'info'

app.use(cors())
app.use(express.static(assets))

app.get('/', (req, res) => {
    res.sendFile(path.join(assets, 'index.html'))
})

app.get('/api/posts', (req, res) => {
    winston.log('debug', `returning ${manifest.posts.length} post(s)`)
    res.send(manifest.posts)
})

// todo - measure performance of this vs "guessing" the link from the post id

app.get('/api/post/:slug', (req, res) => {
    const { slug } = req.params
    const post = manifest.posts.find(p => p.id === slug)

    winston.log('debug', `getting post ID ${slug} - "${post.title}"`)
    res.send(post)
})

app.listen(PORT, () => {
    winston.log('info', 'server running on ' + PORT)
})
