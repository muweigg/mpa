const path = require('path');
const rimraf = require('rimraf');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const SuppressExtractedStyleScriptChunks = require('./plugins/SuppressExtractedStyleScriptChunks');
const {ROOT, SRC, PROD_MODE} = require('./helper');
const devServer = require('./devServer');
const entryUtils = require('./entryUtils');
const spritesmithConfig = require('./spritesmithConfig');

rimraf.sync(path.resolve(ROOT, 'dist'), require('fs'), false);

module.exports = {
  mode: process.env.NODE_ENV,

  devtool: PROD_MODE ? !PROD_MODE : 'inline-source-map',

  devServer: devServer.options,

  stats: 'errors-only',

  entry: {
    ...entryUtils.CSS_ENTRIES,
    ...entryUtils.JS_ENTRIES,
  },

  output: {
    path: path.resolve(ROOT, 'dist'),
    filename: `[name]${PROD_MODE ? '.[contenthash]' : ''}.js`,
    chunkFilename: `[name]${PROD_MODE ? '.[contenthash]' : ''}.js`,
    sourceMapFilename: '[file].map',
  },

  resolve: {
    extensions: ['.vue', '.js'],
    modules: [SRC, path.resolve(ROOT, 'node_modules')],
    alias: {
      '@src': SRC,
      '@css': path.resolve(SRC, 'css'),
      '@assets': path.resolve(SRC, 'assets'),
      '@components': path.resolve(SRC, 'components'),
      'vue$': 'vue/dist/vue.esm.js',
    }
  },

  optimization: {
    runtimeChunk: {name: 'js/runtime'},
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors/vendors',
          chunks: 'initial',
          priority: 10,
          enforce: true
        },
        components: {
          test: /[\\/](components)[\\/].*\.(vue|s?[ac]ss)$/,
          name: 'components/components',
          chunks: 'initial',
          priority: 5,
          enforce: true
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'cache-loader',
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
            },
          },
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              productionMode: PROD_MODE,
              // default config
              transformAssetUrls: {
                video: ['src', 'poster'],
                source: 'src',
                img: 'src',
                image: ['xlink:href', 'href'],
                use: ['xlink:href', 'href']
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          'html-loader',
          {
            loader: path.resolve(ROOT, 'config/loaders/nunjucks-loader.js'),
            options: {
              searchPaths: [path.resolve(SRC, 'templates')],
              options: {
                tags: {
                  variableStart: '<$',
                  variableEnd: '$>',
                }
              },
              context: {}
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 1,
            name: '[path][name].[contenthash].[ext]',
            outputPath: url => url.replace(/^src[\\/]/, '')
          }
        }]
      },
      {
        test: /\.(eot|woff2?|ttf)([\?]?.*)$/,
        use: [{
          loader: 'file-loader',
          options: {
            esModule: false,
            name: '[path][name].[contenthash].[ext]',
            outputPath: url => url.replace(/^src[\\/]/, '')
          }
        }]
      },
      {
        test: /\.(s[ac]|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !PROD_MODE,
              reloadAll: true,
              publicPath: '../',
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name]${PROD_MODE ? '.[contenthash]' : ''}.css`,
      chunkFilename: `[name]${PROD_MODE ? '.[contenthash]' : ''}.css`
    }),
    ...entryUtils.HTML_ENTRIES_PLUGINS,
    ...spritesmithConfig,
  ].concat(!PROD_MODE ? [] : [
    new SuppressExtractedStyleScriptChunks(),
    new HardSourceWebpackPlugin(),
    new HardSourceWebpackPlugin.ExcludeModulePlugin([{
      test: /mini-css-extract-plugin[\\/]dist[\\/]loader/
    }]),
  ])

}
