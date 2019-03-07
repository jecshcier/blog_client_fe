//生产环境配置
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const ncp = require('ncp')
const common = require('./webpack.common')

const config = (env) => {
  //init
  if (env.MODE === 'init') {
    return merge(common, {
      plugins: [
        copyDevFiles()
      ]
    })
  }
  //development
  else if (env.MODE === 'dev') {
    return merge(common, {
      devtool: "source-map",
      devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true
      }
    })
  }
  //product
  else {
    return merge.smart(common, {
      module: {
        rules: [{
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ['css-loader', 'postcss-loader']
          })
        }]
      },
      plugins: [
        new UglifyJsPlugin({
          test: /\.js($|\?)/i,
          exclude: /(node_modules|bower_components)/
        }),
        new ExtractTextPlugin('css/[name].css'),
        copyDevFiles()
      ]
    })
  }
}

/**
 * 复制dev中的静态资源文件
 * @returns {webpack.ProgressPlugin}
 */
function copyDevFiles() {
  return new webpack.ProgressPlugin((percentage, message, ...args) => {
    if (percentage === 1) {
      console.log("编译完成，正在拷贝文件---->")
      ncp.limit = 16;
      ncp(path.join(__dirname, 'dev/lib'), path.join(__dirname, 'dist/lib'), function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('文件拷贝完成！');
      });
    }
  })
}

module.exports = config