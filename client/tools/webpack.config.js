var path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, '../src'),
    entry: './main.es',

    output: {
        path: path.join(__dirname, '../build'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.(js|jsx|es)$/, loader: 'babel' },
            { test: /\.json$/, loader: 'json' },
            { test: /\.json5$/, loader: 'json5' },
            { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url?limit=10000' },
            { test: /\.(ttf|eot|wav|mp3|svg|eot|woff|woff2)$/, loader: 'file?name=[name].[ext][hash]' },
            { test: /\.(wav|mp3)$/, loader: 'file' },
            { test: /\.html/, loader: 'html' },
            { test: /\.(sass|scss)$/, loader: ExtractTextPlugin.extract('style', 'css!sass') },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') }
       ]
    },

    plugins: [
        new ExtractTextPlugin('bundle.css'),
        new webpack.NoErrorsPlugin()
    ],

    devtool: 'cheap-inline-module-source-map',

    resolve: {
        extensions: ['', '.jsx', '.js', '.es', '.json', 'css', 'scss']
    },
};