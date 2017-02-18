const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.css', '.png'],
    modulesDirectories: [
      'node_modules',
    ],
  },
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        query: {
          presets: ['es2015'],
        },
      }, {
        test: /\.css/,
        loader: 'style-loader',
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'],
      }, {
        test: /\.less/,
        loader: 'style!css!less',
      }, {
        test: /\.svg$/,
        loader: 'svg-inline',
      }, {
        test: /\.(woff2|woff|ttf|svg|eot)$/,
        loader: 'file',
      },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
