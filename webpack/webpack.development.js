const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0', // your ip address
    port: 8080,
    hot: true,
    watchFiles: ['src/'],
  },
  output: {
    publicPath: '',
  },
});
