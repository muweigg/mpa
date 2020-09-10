const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');
const {SRC} = require('./helper');

function getConfig (name) {
  return new SpritesmithPlugin({
    src: {
      cwd: path.resolve(SRC, `sprites/${name}`),
      glob: '**/*.png'
    },
    target: {
      image: path.resolve(SRC, `assets/images/${name}.png`),
      css: path.resolve(SRC, `css/_/_${name}.scss`)
    },
    apiOptions: {
      cssImageRef: `~@assets/images/${name}.png`
    },
    spritesmithOptions: {
      padding: 10,
      algorithm: 'top-down',
      algorithmOpts: { sort: true },
      exportOpts: { quality: 100 }
    }
  })
}

module.exports = [
  getConfig('icons')
]
