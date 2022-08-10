const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const node_modules = path.resolve(__dirname, 'node_modules');
const pathToReact = path.resolve(node_modules, 'react/index.js');
const pathToReactDom = path.resolve(node_modules, 'react-dom/index.js');
module.exports = {
  // mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/, // 正则表达式匹配css文件
        use: ['style-loader', 'css-loader'] // 这两个的顺序不能变
      },
      {
        test: /\.(png|jpg|gif)$/i, // 正则匹配图片
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              outputPath: "image"
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.md$/,
        use: ["html-loader", "markdown-loader"]
        // use: ["html-loader"]
      }, {
        test: /\.html$/,
        use: ["html-loader"]
      }
    ],

  },

  resolve: {
    alias: {
      'react': pathToReact,
      'react-dom': pathToReactDom,
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['', '.js', '.jsx'], //后缀名自动补全
  },

  plugins: [
    new CleanWebpackPlugin(), // 打包前清理dist
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom'
    }),
    new HtmlWebpackPlugin({ template: './src/index.html', filename: 'index.html', inject: 'body' }),
    // new webpack.HotModuleReplacementPlugin(),
  ],
  entry: {
    index: './src/index',
  }, //打包文件入口
  output: {               //打包文件出口
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    historyApiFallback: true,
  }
}