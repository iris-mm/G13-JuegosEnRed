const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './public/game/src/main.js',
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

  module: {
    rules: [
      // manejar imágenes
      { test: /\.(png|jpe?g|gif|svg)$/i, type: 'asset/resource' },
      // manejar fuentes
      { test: /\.(woff2?|ttf|otf|eot)$/i, type: 'asset/resource' },
      // manejar audio
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/music_sounds/[name][ext]'
        }
      }
    ]
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
};