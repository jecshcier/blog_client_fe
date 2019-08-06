//生产环境配置
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const fs = require('fs-extra')
const common = require('./webpack.common')

const config = (env) => {
  console.log(env)
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
      devtool: "cheap-module-eval-source-map",
      devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true,
        host: "127.0.0.1"
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    })
  }
  //product
  else {
    return merge.smart(common, {
      devtool: "cheap-module-source-map",
      module: {
        rules: [{
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        }]
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: 'css/[name]-[hash].css'
        }),
        new OptimizeCssAssetsPlugin(),
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
  return new webpack.ProgressPlugin(async (percentage, message, ...args) => {
    if (percentage === 1) {
      console.log("编译完成，正在拷贝文件---->")
      try {
        await fs.copy(path.join(__dirname, 'dev/lib'), path.join(__dirname, 'dist/lib'))
      } catch (err) {
        console.log(err)
      }
    }
  })
}

module.exports = config