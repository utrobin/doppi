var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname,

    entry: {
        index: './assets/js/index',
        add_course: './assets/js/add_course',
        test: './assets/js/test',
    },

    output: {
        path: path.resolve('./static/js/'),
        filename: "[name].js",
    },

    watch: true,

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

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
    ],

    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },
}