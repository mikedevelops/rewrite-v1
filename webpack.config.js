const path = require('path')
const Html = require('html-webpack-plugin')
const Copy = require('copy-webpack-plugin')

const src = path.join(__dirname, 'src')
const www = path.join(__dirname, 'www')

console.log(path.resolve(src, 'hoc'))

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
            },
            {
                test: /\.md$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'posts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.json$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'posts/[name].[ext]'
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            App: __dirname,
            Components: path.resolve(src, 'components'),
            Helpers: path.resolve(src, 'helpers'),
            Hoc: path.resolve(src, 'hoc'),
            Routes: path.resolve(src, 'routes'),
            Assets: path.resolve(src, 'assets')
        }
    },
    devtool: 'source-maps',
    devServer: {
        contentBase: www
    },
    plugins: [
        new Html({ template: path.join(src, 'index.ejs') }),
        new Copy([{ from: 'posts', to: 'posts' }])
    ]
}
