/* eslint-disable max-len */
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
  target: 'web',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-arrow-functions',
              '@babel/plugin-transform-runtime',
              '@babel/plugin-transform-template-literals',
            ],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|webp|jpeg|gif|woff|woff2|eot|ttf|otf|json|hdr|glb|gltf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    // new HtmlInlineScriptPlugin(),
  ],
};
