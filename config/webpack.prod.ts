const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SuppressExtractedTextChunksWebpackPlugin = require('./plugins/SuppressExtractedTextChunksWebpackPlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

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
                    publicPath: '.',
                    use: ['css-loader?importLoaders=1&minimize=true', 'postcss-loader', 'sass-loader']
                }),
                exclude: [fileUtils.common_style]
            },
            {
                test: /\.(s[ac]|c)ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '.',
                    use: ['css-loader?importLoaders=1&minimize=true', 'postcss-loader', 'sass-loader']
                }),
                include: [fileUtils.common_style]
            },
        ]
    },
    plugins: [
        new CleanPlugin(['dist'], { root: helpers.root() }),
        new ExtractTextPlugin('[name].[contenthash].css'),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UglifyJsPlugin({
            sourceMap: false,
            parallel: true,
            uglifyOptions: {
                compress: { warnings: false, drop_console: true },
                output: { comments: false },
                ie8: true,
            }
        }),
        // new ManifestPlugin(),
    ]
});