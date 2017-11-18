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
                {
                    test: /\.html$/,
                    use: [{
                        loader: 'html-loader',
                        options: htmlLoaderConfig,
                    }, `nunjucks-html-loader?${JSON.stringify(nunjucksConfig)}`]
                },
                { test: /\.json$/, use: ['json-loader'] },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: '[path][name].[hash].[ext]',
                            outputPath: url => url.replace(/src|node_modules/, '.')
                        }
                    }]
                },
                {
                    test: /\.(eot|woff2?|ttf)([\?]?.*)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[hash].[ext]',
                            outputPath: url => url.replace(/src|node_modules/, '.')
                        }
                    }]
                },
            ]
        },

        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
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