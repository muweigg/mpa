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
const commonEntrys = {
    'js\\common': [helpers.root('src/js/common/common.ts')]
};

let entriesDict = {};

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

function getHTML () {
    let entires = {};
    let result = getFiles(...scan_html);

    for (let html in result) {
        let fullPath = result[html];
        let str = '\\templates\\';
        let s = fullPath.indexOf(str) + str.length;
        let keyName = fullPath.substr(s);
        let key = keyName.substr(0, keyName.lastIndexOf('.'));
        entires[keyName] = [fullPath];
        entriesDict[`css\\${key}`] = true;
        entriesDict[`js\\${key}`] = true;
    }

    return entires;
}

function getJS () {
    let entires = {};
    let result = getFiles(...scan_js);

    for (let js in result) {
        let fullPath = result[js];
        let s = fullPath.indexOf('\\js\\');
        let e = fullPath.lastIndexOf('.') - s;
        let keyName = fullPath.substr(s, e).substr(1);
        if (entriesDict[keyName])
            entires[keyName] = [fullPath];
    }

    return entires;
}

function getCSS () {
    let entires = {};
    let result = getFiles(...scan_css);

    for (let css in result) {
        let fullPath = result[css];
        let s = fullPath.indexOf('\\css\\');
        let e = fullPath.lastIndexOf('.') - s;
        let keyName = fullPath.substr(s, e).substr(1);
        if (entriesDict[keyName])
            entires[keyName] = [fullPath];
    }

    return entires;
}

function getEntires () {
    let html = getHTML();
    let js   = getJS();
    let css  = getCSS();
    return {...js, ...css}
}

function getHTMLPlugin () {
    let plugins = [];
    let result = getHTML();

    for (let html in result) {
        let fullPath = result[html][0];
        let keyName = html.substr(0, html.lastIndexOf('.'));
        plugins.push( new HtmlPlugin({
            filename: html,
            template: fullPath,
            chunks: [
                'runtime',
                'vendors\\vendors',
                'components\\components',
                'js\\common',
                `css\\${keyName}`,
                `js\\${keyName}`,
            ],
            chunksSortMode: 'dependency',
            inject: 'body',
        }) );
    }

    return plugins;
}

exports.getEntires = getEntires;
exports.getHTMLPlugin = getHTMLPlugin;
exports.commonEntrys = commonEntrys;
