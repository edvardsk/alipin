var path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, '.'),
    entry: './main.es',

    output: {
        path: path.join(__dirname, './build'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.(js|jsx|es)$/, loader: 'babel', exclude: /node_modules/, query: { presets: ['es2015', 'react', 'stage-1'] } },
            { test: /\.html/, loader: 'html' }
       ]
    },

    plugins: [
        new webpack.NoErrorsPlugin()
    ],

    devtool: 'cheap-inline-module-source-map',

    resolve: {
        extensions: ['', '.jsx', '.js', '.es', '.json', 'css', 'scss'],
        modulesDirectories: ['node_modules', '../client/src/scripts']
    }
};