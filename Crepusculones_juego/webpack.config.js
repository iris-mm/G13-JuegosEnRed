//COPIADO TAL CUAL DE LAS DIAPOS, REVISAR

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // **entry**: Punto de entrada de la aplicación
  entry: './src/index.js',

  // **output**: Dónde se guarda el bundle generado
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true // Limpia la carpeta 'dist' antes de cada build
  },

  // **plugins**: Añade funcionalidades extra (como generar el HTML automáticamente)
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Usa esta plantilla HTML
      filename: 'index.html' // Nombre del archivo generado
    })
  ],

  // **devServer**: Configuración del servidor de desarrollo con recarga automática
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 3000,
    open: true, // Abre el navegador automáticamente
    hot: true // Habilita hot-reload
  },

  // Configuración para trabajar con archivos JS modernos
  module: {
    rules: [
      {
        test: /\.js$/, // Aplica a archivos .js
        exclude: /node_modules/, // Ignora node_modules
        use: {
          loader: 'babel-loader' // Transpila JS moderno a compatible
        }
      }
    ]
  },

  // Modo por defecto si no se especifica en el script
  mode: 'development'
};