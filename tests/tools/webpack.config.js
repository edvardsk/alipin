var path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    webpack = require('webpack');

module.exports = function (name) {
    return {
        context: path.join(__dirname, '../' + name),
        entry: './main.es',
        output: {
            path: path.join(__dirname, '../build'),
            filename: name + '.bundle.js'
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

        resolve: {
            extensions: ['', '.jsx', '.js', '.es', '.json', 'css', 'scss'],
            modulesDirectories: ['node_modules', '../../client/src/scripts']
        }
    };
}
