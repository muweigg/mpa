const HtmlWebpackPlugin = require('html-webpack-plugin');

const isHot = /--hot/i.test(process.argv.join(' '));

module.exports = {
  options: {
    port: 4444,
    host: '0.0.0.0',
    // historyApiFallback: { disableDotRule: true },
    compress: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    },
    before(app, server, compiler) {
      if (!isHot) return false;

      const cache = {};
      compiler.hooks.compilation.tap(
        'HTMLReloadPlugin',
        compilation => {
          HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
            'HTMLReloadPlugin',
            (data, cb) => {
              const original = cache[data.outputName];
              const html = data.html;
              if (original !== html) {
                server.sockWrite(server.sockets, 'content-changed');
              }
              cache[data.outputName] = html;
              cb && cb();
            }
          )
        });
    }
  }
}

