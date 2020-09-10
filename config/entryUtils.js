const path = require('path');
const requireContext = require('require-context');
const HtmlPlugin = require('html-webpack-plugin');
const {SRC} = require('./helper');

const SCAN_JS = requireContext(path.resolve(SRC, 'js'), true, /[A-Za-z0-9-_,\s]+\.js/i);
const SCAN_CSS = requireContext(path.resolve(SRC, 'css'), true, /[A-Za-z0-9-_,\s]+\.s?css/i);
const SCAN_HTML = requireContext(path.resolve(SRC, 'views'), true, /[A-Za-z0-9-_,\s]+\.html/i);
const FILTER_RULES = /(js|css)[\\/]common|^[\\/]?_[\\/]/i;
const HTML_ENTRIES = {}, JS_ENTRIES = {}, CSS_ENTRIES = {};

JS_ENTRIES['js/common'] = `${SRC}/js/common.js`;
CSS_ENTRIES['css/common'] = `${SRC}/css/common.scss`;

SCAN_HTML.keys().forEach((key) => HTML_ENTRIES[key.replace(path.extname(key), '')] = `${SRC}/views/${key}`);
SCAN_JS.keys().filter(key => !FILTER_RULES.test(key) && HTML_ENTRIES[key.replace(path.extname(key), '')])
  .forEach((key) => JS_ENTRIES[`js/${key.replace(path.extname(key), '')}`] = `${SRC}/js/${key}`);
SCAN_CSS.keys().filter(key => !FILTER_RULES.test(key) && HTML_ENTRIES[key.replace(path.extname(key), '')])
  .forEach((key) => CSS_ENTRIES[`css/${key.replace(path.extname(key), '')}`] = `${SRC}/css/${key}`);

const HTML_ENTRIES_PLUGINS = Object.keys(HTML_ENTRIES).map((key) => {
  const options = {
    filename: `${key}.html`,
    template: HTML_ENTRIES[key],
    chunks: [
      'js/runtime',
      'vendors/vendors',
      'components/components',
      'css/common',
      'js/common',
      `css/${key}`,
      `js/${key}`,
    ],
    chunksSortMode: 'auto',
    inject: 'body',
  };
  return new HtmlPlugin(options);
});

module.exports = {
  HTML_ENTRIES, JS_ENTRIES, CSS_ENTRIES, HTML_ENTRIES_PLUGINS
}
