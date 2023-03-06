/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseWebpackConfig = {
  devtool: 'inline-source-map',
  entry: {
    'background': './src/js/app/background/background.ts',
    'handler': './src/js/app/content/handler.ts',
    'options_page/index': './src/options_page/options_page.js',
  },

  mode: 'development',

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
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

  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin({
      extractComments: 'all',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    })],
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'manifest.json'),
          to: path.join(__dirname, 'dist'),
        },
        {
          context: 'src/img',
          from: '**/*.png',
          to: path.join(__dirname, 'dist', 'img'),
        },
        {
          context: 'src/font',
          from: '**/*.*',
          to: path.join(__dirname, 'dist', 'font'),
        },
        {
          context: 'src/options_page',
          from: path.join('**', '*.*'),
          globOptions: {
            ignore: ['**/options_page.js'],
          },
          to: path.join(__dirname, 'dist', 'options_page'),
        },
      ],
    }),
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // for development
  if (!isProduction) {
    return baseWebpackConfig;
  }

  // for production
  const newWebpackConfig = {
    ...baseWebpackConfig,
    mode: 'production',
  };

  newWebpackConfig.optimization.minimize = true;

  return newWebpackConfig;
};
