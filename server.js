const express = require('express')
const path = require('path')
const cors = require('cors')
const { getAllPosts } = require('./server/helpers/posts.helper')

const app = express()
const PORT = process.env.PORT || 3000
const assets = path.join(__dirname, 'www')

app.use(cors())
app.use(express.static(assets))

app.get('/', (req, res) => {
    res.sendFile(path.join(assets, 'index.html'))
})

app.get('/api/posts', (req, res) => {
    res.send(getAllPosts(assets))
})

app.get('/post/:id/:post', (req) => {
    // return post data
    console.log(req.params)
})

app.listen(PORT, () => {
    console.log('Server running on ', PORT)
})
