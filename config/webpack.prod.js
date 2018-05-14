const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const SuppressExtractedTextChunksWebpackPlugin = require('./plugins/SuppressExtractedTextChunksWebpackPlugin');
// const ManifestPlugin = require('webpack-manifest-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = "production";
const fileUtils = require('./fileUtils');

module.exports = webpackMerge(config({ env: ENV }), {

    output: {
        filename: '[name].[chunkhash:12].js',
        chunkFilename: '[name].[chunkhash:12].js',
    },
    
    optimization: {

        minimizer: [
            new UglifyJsPlugin({
                sourceMap: false,
                parallel: true,
                uglifyOptions: {
                    compress: { warnings: false, drop_console: true },
                    output: { comments: false },
                    ie8: true,
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    zindex: false,
                    discardComments: { removeAll: true },
                }
            }),
        ]
    },

    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { publicPath: '.' }
                    },
                    'css-loader?importLoaders=1',
                    'postcss-loader',
                    'sass-loader',
                ]
            },
        ]
    },
    plugins: [
        new CleanPlugin(['dist'], { root: helpers.root() }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:12].css',
            chunkFilename: '[name].[contenthash:12].css'
        }),
        new SuppressExtractedTextChunksWebpackPlugin(),
        // new ManifestPlugin(),
    ]
});