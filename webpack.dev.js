// const webpack = require('webpack');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader',
          }, {
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
      }],
  },

  entry: {
    handler: './src/js/app/content/handler.ts',
    background: './src/js/app/background/background.ts',
    options_page: './src/js/app/options/options_page.js',
    options_page_ts: './src/js/app/options/options_page.tsx',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js'),
  },

  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },
  performance: {hints: false},
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'manifest.json'),
          to: path.join(__dirname, 'dist'),
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*.png',
          to: path.join(__dirname, 'dist/img/'),
          context: 'src/img',
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*.html',
          to: path.join(__dirname, 'dist/html/'),
          context: 'src/html',
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*.*',
          to: path.join(__dirname, 'dist/css/'),
          context: 'src/css',
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*.js',
          to: path.join(__dirname, 'dist/js/vendor'),
          context: 'src/js/vendor',
        },
      ],
    }),
  ],
};
