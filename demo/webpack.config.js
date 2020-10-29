const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const pkg = require('./package.json')

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/dist/',
    filename: pkg.name + '.js',
    library : pkg.name,
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: ['node_modules']
  },
  externals: {
    vue: 'vue'
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl(us)$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
    ]
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onEnd: [
          {
            copy: [
              { source: './package.json', destination: './lib/package.json' },
            ]
          },
          {
            archive: [
              { source: './lib/package.json', destination: pkg.name + '.zip' }
            ],
          },
          {
            delete: ['./lib/package.json'],
          }
        ],
      },
    }),
    new VueLoaderPlugin()
  ]
}
