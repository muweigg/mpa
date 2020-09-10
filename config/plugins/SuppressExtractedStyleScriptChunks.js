module.exports = class SuppressExtractedStyleScriptChunks {

  name = 'SuppressExtractedStyleScriptChunks';

  apply(compiler) {
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      const cssChunks = {};
      const entries = compilation.options.entry;

      const extname = /\.(css|scss|sass|less|styl|html)$/;
      for (let entry of Object.keys(entries)) {
        const chunks = entries[entry];
        const isArray = Object.prototype.toString.call(chunks) === '[object Array]';
        isArray ? chunks.every((chunk) => chunk.match(extname) && (cssChunks[entry] = 1))
          : chunks.match(extname) && (cssChunks[entry] = 1);
      }

      compilation.hooks.afterSeal.tapAsync(this.name, (cb) => {
          compilation.chunks.filter(chunk => cssChunks[chunk.name])
            .forEach(chunk => {
              const files = [];
              chunk.files.forEach((file) => {
                file.match(/\.js(\.map)?$/)
                  ? delete compilation.assets[file]
                  : files.push(file);
              });
              chunk.files = files;
            });
          cb && cb();
        }
      );
    });
  }
}
