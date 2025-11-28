const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    port: 8080
  },
  externals: {
    phaser: 'Phaser'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: false
    })
  ],
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      // Manejar imágenes (png, jpg, jpeg, gif, svg)
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
      // Si se necesita se puede añadir (CSS, audio, etc.)
    ]
  },
};