const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const PROD_MODE = process.env.NODE_ENV === 'production';

module.exports = {
  ROOT, SRC, PROD_MODE
}
