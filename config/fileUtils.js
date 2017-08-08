/**
 * @author: MuWei
 */
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const HtmlPlugin = require('html-webpack-plugin');

const scan_js   = ['./src/js', /\.ts$/i];
const scan_scss = ['./src/scss', /\.scss$/i];
const scan_html = ['./src/templates', /\.html$/i];

const polyfill = helpers.root('src/js/common/polyfill.ts');
const vendor = helpers.root('src/js/common/vendor.ts');
const common_style = helpers.root('src/scss/common/common.scss');

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
            walkDir(fullPath, ext, result);
        }
    }
    return result;
}

function getJS () {
    let entires = {};
    let result = getFiles(...scan_js);

    for (let js in result) {
        let fileName = js.substr(0, js.indexOf('.'));
        let fullPath = result[js];
        entires[`js\\${fileName}`] = [helpers.root(fullPath)];
    }

    return entires;
}

function getSCSS () {
    let entires = [];
    let result = getFiles(...scan_scss);

    for (let scss in result) {
        let fileName = scss.substr(0, scss.indexOf('.'));
        let fullPath = result[scss];
        entires[`css\\${fileName}`] = [helpers.root(fullPath)];
    }

    return entires;
}

function getHTML () {
    let entires = [];
    let result = getFiles(...scan_html);

    for (let html in result) {
        let fullPath = result[html];
        entires[html] = [helpers.root(fullPath)];
    }

    return entires;
}

function getEntires () {
    let js   = getJS();
    let scss = getSCSS();
    let html = getHTML();
    return { ...js, ...scss, ...html };
}

function getHTMLPlugin () {
    let plugins = [];
    let result = getFiles(...scan_html);

    for (let html in result) {
        let fileName = html.substr(0, html.indexOf('.'));
        let fullPath = result[html];
        plugins.push( new HtmlPlugin({
            filename: html,
            template: fullPath,
            chunks: [
                'js/common/manifest',
                ...Object.keys(commonEntries),
                `css\\${fileName}`,
                `js\\${fileName}`,
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
