const helpers = require('./helpers');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devServer = require('./devServer');
const spritesmithConfig = require('./spritesmithConfig');
const htmlLoaderConfig = require('./htmlLoaderConfig');
const nunjucksConfig = require('./nunjucksConfig');

const fileUtils = require('./fileUtils');

module.exports = function (options) {

    const supportES2015 = helpers.supportES2015();

    return {

        devServer: devServer,

        entry: {
            ...fileUtils.commonEntries,
            ...fileUtils.getEntires()
        },

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].[name].chunk.js',
            sourceMapFilename: '[file].map',
        },

        resolve: {
            extensions: ['.ts', '.js', '.vue'],
            modules: [helpers.root('src'), helpers.root('node_modules')],
            alias: Object.assign({}, helpers.rxjsAlias(supportES2015), { 'vue$': 'vue/dist/vue.esm.js' })
        },

        optimization: {
            runtimeChunk: { name: 'js\\runtime' },
            splitChunks: {
                cacheGroups: {
                    vendorJS: {
                        test: /[\\/]node_modules[\\/].*\.(t|j)sx?$|[\\/]common[\\/].*\.(t|j)s$/,
                        name: 'js\\vendors',
                        chunks: 'initial',
                        priority: -10,
                        enforce: true
                    },
                    vendorCSS: {
                        test: /[\\/]node_modules[\\/].*\.s?(a|c)ss$|[\\/]common[\\/].*\.s?(a|c)ss$/,
                        name: 'css\\vendors',
                        chunks: 'initial',
                        priority: -10,
                        enforce: true
                    },
                    components: {
                        test: /[\\/]components[\\/].*\.vue$/,
                        name: 'components\\components',
                        chunks: 'initial',
                        priority: -20,
                        enforce: true
                    },
                }
            },
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        'cache-loader',
                        {
                            loader: 'thread-loader',
                            options: {
                                workers: require('os').cpus().length - 1,
                            },
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                happyPackMode: true,
                                appendTsSuffixTo: [/\.vue$/],
                            }
                        }
                    ]
                },
                {
                    test: /\.vue$/,
                    use: [
                        {
                            loader: 'vue-loader',
                            options: {
                                ts: 'ts-loader'
                            }
                        }
                    ]
                },
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
                            name: '[path][name].[hash:12].[ext]',
                            outputPath: url => url.replace(/^src/, '.')
                        }
                    }]
                },
                {
                    test: /\.(eot|woff2?|ttf)([\?]?.*)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[hash:12].[ext]',
                            outputPath: url => url.replace(/^src/, '.')
                        }
                    }]
                },
            ]
        },

        plugins: [
            new VueLoaderPlugin(),
            new ForkTsCheckerWebpackPlugin({ vue: true }),
            ...fileUtils.getHTMLPlugin(),
            ...spritesmithConfig,
            // new BundleAnalyzerPlugin(),
        ]
    }
}