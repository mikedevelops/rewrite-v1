const marked = require('marked')

// todo - post helpers for creating objects ect...

function createPostObject (file) {
    console.log(marked(file))
}

module.exports = { createPostObject }
