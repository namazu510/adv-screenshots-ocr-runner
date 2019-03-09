const path = require('path')

module.exports = {
  mode: 'production',
  target: 'electron-main',
  entry: './node_modules/tesseract.js/src/node/worker.js',
  output: {
    path: path.resolve(__dirname,'dist_electron'),
    filename: 'worker.js'
  }
}
