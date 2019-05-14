// 一个常见的`webpack`配置文件
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");//用来清除因html-webpack-plugin产生的build中冗余的hash文件中的残余文件
const WebpackDevServer = require("webpack-dev-server");
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
        mode: 'development',
        entry:__dirname + "/main.js", //代表入口(总)文件，可以写多个
        output: {
            path: __dirname + "/build",//输出文件夹
            filename: "bundle-[hash].js"//最终打包生成的js文件名
        },
        devtool: 'eval-source-map',
        devServer: {
            contentBase: "./build", //本地服务器所加载的页面所在的目录
            historyApiFallback: true, //不跳转
            inline: true,
            hot: true
        },
        module:{
            rules:[{
                test: /(\.jsx|\.js)$/,// test 符合此正则规则的文件，运用 loader 去进行处理，除了exclude 中指定的内容
                loader: "babel-loader",
                exclude:/node_modules/
            },{
                test: /\.(png|jpg)$/,
                use:["url-loader"]
            },{
                test: /(\.css|\.scss)$/,// test 符合此正则规则的文件，运用 loader 去进行处理，除了exclude 中指定的内容
                use:["style-loader","css-loader","sass-loader"]//需要注意的是，module.rules.use数组中，loader 的位置。根据 webpack 规则：放在最后的 loader 首先被执行。所以，首先应该利用sass-loader将 scss 编译为 css，剩下的配置和处理 css 文件相同
            }]
        },
        plugins:[
            new HtmlWebpackPlugin({
                template: __dirname + "/index.tmpl.html",//new 一个这个插件的实例，并传入相关的参数
            }),
            new CleanWebpackPlugin(),//用来清除因html-webpack-plugin产生的build中冗余的hash文件中的残余文件
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ]
};