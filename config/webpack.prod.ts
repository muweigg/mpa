const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SuppressExtractedTextChunksWebpackPlugin = require('./plugins/SuppressExtractedTextChunksWebpackPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = "production";
const fileUtils = require('./fileUtils');

export default webpackMerge(config({ env: ENV }), {
    output: {
        filename: '[name].[chunkhash].bundle.js',
        chunkFilename: '[id].[chunkhash].chunk.js',
    },
    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?importLoaders=1', 'postcss-loader', 'sass-loader']
                }),
                exclude: [fileUtils.common_style]
            },
            {
                test: /\.(s[ac]|c)ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?importLoaders=1', 'postcss-loader', 'sass-loader']
                }),
                include: [fileUtils.common_style]
            },
        ]
    },
    plugins: [
        new CleanPlugin(['dist'], { root: helpers.root() }),
        new ExtractTextPlugin('[name].[contenthash].css'),
        new webpack.optimize.UglifyJsPlugin({
            mangle: { screw_ie8: true },
            compress: { screw_ie8: true, warnings: false, drop_console: true },
            sourceMap: false
        }),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ]
});