const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
// const webpackMergeDll = webpackMerge.strategy({ plugins: 'replace' });

const fileUtils = require('./fileUtils');

module.exports = webpackMerge(config(), {

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/,
                use: ['vue-style-loader', 'css-loader?importLoaders=1', 'postcss-loader', 'sass-loader'],
            }
        ]
    },
    
    plugins: []
});