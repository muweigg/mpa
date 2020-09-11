const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SuppressExtractedStyleScriptChunks = require('./plugins/SuppressExtractedStyleScriptChunks');
const {ROOT, SRC} = require('./helper');
const devServer = require('./devServer');
const entryUtils = require('./entryUtils');
const spritesmithConfig = require('./spritesmithConfig');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    ...entryUtils.CSS_ENTRIES,
    ...entryUtils.JS_ENTRIES,
  },

  devtool: isDev ? 'inline-source-map' : false,

  devServer: devServer.options,

  output: {
    path: path.resolve(ROOT, 'dist'),
    filename: `[name]${!isDev ? '.[contenthash]' : ''}.js`,
    chunkFilename: `[name]${!isDev ? '.[contenthash]' : ''}.js`,
    sourceMapFilename: '[file].map',
  },

  resolve: {
    extensions: ['.js', '.vue'],
    modules: [SRC, path.resolve(ROOT, 'node_modules')],
    alias: {
      '@src': SRC,
      '@assets': path.resolve(SRC, 'assets'),
      '@css': path.resolve(SRC, 'css'),
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
          priority: -10,
          minChunks: 3,
          enforce: true
        },
        components: {
          test: /[\\/](components|node_modules)[\\/].*\.vue$/,
          name: 'components/components',
          chunks: 'initial',
          priority: -5,
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
              productionMode: !isDev,
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
            limit: 10240,
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
              hmr: isDev,
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
      filename: `[name]${!isDev ? '.[contenthash]' : ''}.css`,
      chunkFilename: `[name]${!isDev ? '.[contenthash]' : ''}.css`
    }),
    ...entryUtils.HTML_ENTRIES_PLUGINS,
    ...spritesmithConfig,
  ].concat(isDev ? [] : [
    new CleanWebpackPlugin(),
    new SuppressExtractedStyleScriptChunks(),
  ])

}
