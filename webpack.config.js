var path = require("path");
var webpack = require('webpack');

module.exports = {
    context: __dirname,

    entry: {
        search_course: './assets/js/search_course',
        add_course: './assets/js/add_course',
        test: './assets/js/test',
        pinki: './assets/js/pinki',
    },

    output: {
        path: __dirname + '/static/js',
        filename: "[name].js",
    },

    watchOptions: {
        aggregateTimeout: 100
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {presets: ['es2015', 'react', 'stage-2']}
            }
        ],
    },

    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },
}