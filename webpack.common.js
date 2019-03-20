const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  entry: {
    main: './dev/index.js'
    // vendor: ['react', 'react-dom', 'antd', 'lodash', 'moment']
  },
  output: {
    filename: 'js/[name]-[hash].js',
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/react', '@babel/env'],
          plugins: [
            ["@babel/proposal-class-properties", {"spec": true}],
            ["@babel/plugin-transform-runtime"]
          ]
        }
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
    }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "initial",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '-',
      name: 'lib/vender.bundle',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    // webpack3版本 废弃
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor",
    //   filename: "js/lib/vender.bundle.js"
    // }),
    new HtmlWebpackPlugin({
      title: 'hugo客户端 by cherry2',
      filename: 'index.html',
      template: path.join(__dirname, 'dev/templates/index.html'),
      hash: true,
      chunks: ['lib/vender.bundle', 'main'],
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    })
  ]
}