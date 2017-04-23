const path = require('path')
const Html = require('html-webpack-plugin')
const BuildPosts = require('./build/BuildPosts')
const src = path.join(__dirname, 'src')
const www = path.join(__dirname, 'www')
const posts = path.join(__dirname, 'posts')

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
                        presets: ['env', 'es2015', 'react']
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            App: __dirname,
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
        new BuildPosts({ src: posts })
    ]
}
