const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackMergeDll = webpackMerge.strategy({ plugins: 'replace' });
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const fileUtils = require('./fileUtils');

export default webpackMerge(config({ env: ENV }), {
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/,
                use: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader', 'sass-loader'],
                exclude: [fileUtils.common_style]
            },
            {
                test: /\.(s[ac]|c)ss$/,
                use: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader', 'sass-loader'],
                include: [fileUtils.common_style]
            },
        ]
    },
    plugins: []
});