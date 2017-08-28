const helpers = require('./helpers');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

const devServer = require('./devServer');
const spritesmithConfig = require('./spritesmithConfig');
const htmlLoaderConfig = require('./htmlLoaderConfig');
const nunjucksConfig = require('./nunjucksConfig');

const fileUtils = require('./fileUtils');

module.exports = function(options) {

    const isProd = options.env === 'production';

    return {

        devServer: devServer,

        entry: {
            ...fileUtils.commonEntries,
            ...fileUtils.getEntires()
        },

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js',
            sourceMapFilename: '[file].map',
        },

        resolve: {
            extensions: ['.ts', '.js', '.vue'],
            modules: [helpers.root('src'), helpers.root('node_modules')]
        },

        module: {
            rules: [
                { test: /\.ts$/, use: ['ts-loader'] },
                { test: /\.html$/, use: ['html-loader', `nunjucks-html-loader?${JSON.stringify(nunjucksConfig)}`] },
                { test: /\.json$/, use: ['json-loader'] },
                { test: /\.(jpe?g|png|gif|svg)$/, use: 'url-loader?limit=10240' },
                { test: /\.(eot|woff2?|ttf)([\?]?.*)$/, use: 'file-loader' },
            ]
        },

        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.LoaderOptionsPlugin({
                debug: !isProd,
                minimize: isProd,
                options: {
                    context: '',
                    htmlLoader: htmlLoaderConfig,
                    sassLoader: { sourceMap: false, includePaths: [] },
                    urlLoader: { name: '[path][name].[hash].[ext]', outputPath: url => url.replace(/src|node_modules/, '.') },
                    fileLoader: { name: '[path][name].[hash].[ext]', outputPath: url => url.replace(/src|node_modules/, '.') },
                }
            }),
            new webpack.DefinePlugin({
                'PROD_ENV': JSON.stringify(isProd)
            }),
            /* new CopyPlugin([{
                from: helpers.root('src/assets'),
                to: 'assets',
                ignore: ['favicon.ico']
            }]), */
            new webpack.optimize.CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills'],
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                chunks: ['vendor'],
                minChunks: module => /node_modules/.test(module.resource)
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'js/common/manifest',
                minChunks: Infinity
            }),
            new ScriptExtHtmlWebpackPlugin({
                sync: /manifest|polyfill|vendor/,
                defaultAttribute: 'async',
            }),
            ...fileUtils.getHTMLPlugin(),
            ...spritesmithConfig,
        ]
    }
}