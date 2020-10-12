// WebpackWatchRunPlugin.js
/*
 * This simple webpack plugin helps to identify the list of file changes, that
 * triggered webpack re-compilation/re-build
 */
const chalk = require('chalk');

class WebpackWatchRunPlugin {
  constructor(options) {
    if (typeof options !== "object") options = {};
    this.options = options;
  }

  apply(compiler) {
    const options = this.options;
    compiler.hooks.watchRun.tapAsync('WebpackWatchRunPlugin', (_compiler, done) => {
      const { watchFileSystem } = _compiler;
      const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;
      const changedTimes = watcher.mtimes;
      const changedFiles = Object.keys(changedTimes)
        .map(file => `\n  ${file}`)
        .join("");
      if (changedFiles.length) {
        console.log(chalk`{cyan.bold Files modified:} {green.bold ${changedFiles}}`);
      }
      done();
    });
  }
}

module.exports = WebpackWatchRunPlugin;
