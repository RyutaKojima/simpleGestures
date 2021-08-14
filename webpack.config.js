const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseWebpackConfig = {
  devtool: 'inline-source-map',
  entry: {
    background: './src/js/app/background/background.ts',
    handler: './src/js/app/content/handler.ts',
    options_page: './src/js/app/options/options_page.js',
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
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: 'src/img',
          from: '**/*.png',
          to: path.join(__dirname, 'dist/img/'),
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: 'src/html',
          from: '**/*.html',
          to: path.join(__dirname, 'dist/html/'),
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: 'src/css',
          from: '**/*.*',
          to: path.join(__dirname, 'dist/css/'),
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: 'src/js/vendor',
          from: '**/*.js',
          to: path.join(__dirname, 'dist/js/vendor'),
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
  if ( !isProduction ) {
    return baseWebpackConfig;
  }

  // for production
  const newWebpackConfig = {
    ...baseWebpackConfig,
    mode: 'production',
  };

  newWebpackConfig.optimization.minimize = true;
  newWebpackConfig.optimization.minimizer = [new TerserPlugin({
    extractComments: 'all',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  })];

  return newWebpackConfig;
};
