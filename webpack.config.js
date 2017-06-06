const path = require('path')
const Html = require('html-webpack-plugin')
const Manifest = require('./build/PostManifest')
const { version } = require('./package.json')
const postHelpers = require('./build/post.helpers')
const src = path.join(__dirname, 'src')
const www = path.join(__dirname, 'www')
const posts = process.env.BENCHMARK !== 'true'
    ? path.join(__dirname, 'posts')
    : path.join(__dirname, 'benchmark/posts')

module.exports = {
    entry: path.join(src, 'index.js'),
    output: {
        filename: 'app.bundle.js',
        path: www
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react']
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            App: __dirname,
            Utils: path.resolve(__dirname, 'utils'),
            Build: path.resolve(__dirname, 'build'),
            Components: path.resolve(src, 'components'),
            Helpers: path.resolve(src, 'helpers'),
            ServerHelpers: path.resolve(__dirname, 'server/helpers'),
            Hoc: path.resolve(src, 'hoc'),
            Routes: path.resolve(src, 'routes'),
            Assets: path.resolve(src, 'assets'),
            Tests: path.resolve(__dirname, 'tests')
        }
    },
    devtool: 'source-maps',
    devServer: {
        contentBase: www
    },
    plugins: [
        new Html({ template: path.join(src, 'index.ejs') }),
        new Manifest(
            { posts: posts, manifest: path.join(__dirname, 'post-manifest.json') },
            new Date(),
            version,
            process.env.NODE_ENV,
            postHelpers
        )
    ]
}
