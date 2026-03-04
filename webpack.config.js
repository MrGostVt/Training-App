const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const dotenv = require('dotenv');

const env = dotenv.config().parsed || {};

const mergedEnv = { ...env, ...process.env };


const envKeys = Object.keys(mergedEnv).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(mergedEnv[next]);
  return prev;
}, {});

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|webp|webm)$/i, 
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin(envKeys),
    new WebpackObfuscator({
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false,
      debugProtectionInterval: 0,
      disableConsoleOutput: true,
      identifierNamesGenerator: "hexadecimal",
      log: false,
      renameGlobals: false,
      rotateStringArray: true,
      selfDefending: false,
      stringArray: true,
      stringArrayEncoding: ["base64"],
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // host: 'localhost',
    compress: true,
    port: 9000,
  }
};
