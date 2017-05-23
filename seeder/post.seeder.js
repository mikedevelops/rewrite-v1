const fs = require('fs')
const path = require('path')
const util = require('../utils/fs.utils')
const TOTAL = 10000

for (let i = 0; i < TOTAL; i++) {
    const title = `18-5-2017-post-${i}.md`
    const post = `---\ntitle: foo\nauthor: bar\nlead: baz\n...`

    console.log('writing post ' + path.join('./benchmark/posts', title))

    util.deepWriteSync(path.join('./benchmark/posts', title), post)
}

console.log('finsihed writing ' + TOTAL + ' posts')

