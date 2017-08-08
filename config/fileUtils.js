/**
 * @author: MuWei
 */
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const HtmlPlugin = require('html-webpack-plugin');

const scan_js   = [helpers.root('src/js'), /\.ts$/i];
const scan_css  = [helpers.root('src/css'), /\.scss$/i];
const scan_html = [helpers.root('src/templates'), /\.html$/i];

const polyfill     = helpers.root('src/js/common/polyfill.ts');
const vendor       = helpers.root('src/js/common/vendor.ts');
const common_style = helpers.root('src/css/common/common.scss');

const commonEntries = {
    'js/common/polyfill': [polyfill],
    'js/common/vendor': [vendor],
    'css/common': [common_style],
}

function getFiles(dirPath = './', ext = /\.html$/i, result = {}) {
    let entires = fs.readdirSync(dirPath);
    for (let entry of entires) {
        let fullPath = path.join(dirPath, entry);
        let stats = fs.statSync(fullPath);
        if (stats && stats.isFile()) {
            if (ext.test(fullPath)) result[entry] = fullPath;
        } else if (stats && stats.isDirectory() && entry !== 'common') {
            getFiles(fullPath, ext, result);
        }
    }
    return result;
}

function getJS () {
    let entires = {};
    let result = getFiles(...scan_js);

    for (let js in result) {
        let fullPath = result[js];
        let keyName = fullPath.substr(fullPath.indexOf('\\js\\'), fullPath.lastIndexOf('.')).substr(1);
        entires[keyName] = [fullPath];
    }

    return entires;
}

function getCSS () {
    let entires = [];
    let result = getFiles(...scan_css);

    for (let css in result) {
        let fullPath = result[css];
        let keyName = fullPath.substr(fullPath.indexOf('\\css\\'), fullPath.lastIndexOf('.')).substr(1);
        entires[keyName] = [fullPath];
    }

    return entires;
}

function getHTML () {
    let entires = [];
    let result = getFiles(...scan_html);

    for (let html in result) {
        let str = '\\templates\\';
        let fullPath = result[html];
        let keyName = fullPath.substr(fullPath.indexOf(str) + str.length, fullPath.lastIndexOf('.'));
        entires[keyName] = [fullPath];
    }

    return entires;
}

function getEntires () {
    let js   = getJS();
    let css  = getCSS();
    let html = getHTML();
    return { ...js, ...css, ...html };
}

function getHTMLPlugin () {
    let plugins = [];
    let result = getFiles(...scan_html);

    for (let html in result) {
        let fullPath = result[html];
        plugins.push( new HtmlPlugin({
            filename: html,
            template: fullPath,
            chunks: [
                'js/common/manifest',
                ...Object.keys(commonEntries),
                `css\\${html}`,
                `js\\${html}`,
            ],
            chunksSortMode: 'dependency',
            inject: 'body',
        }) );
    }

    return plugins;
}

exports.getEntires = getEntires;
exports.getHTMLPlugin = getHTMLPlugin;
exports.commonEntries = commonEntries;
exports.common_style = common_style;