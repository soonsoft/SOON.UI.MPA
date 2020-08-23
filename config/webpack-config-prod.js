// 压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 清理
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const { merge } = require("webpack-merge");
const base = require("./webpack-config-base");

module.exports = merge(base, {
    mode: "production",
    devtool: "nosources-source-map",
    optimization: {
        minimizer: [
            // https://github.com/mishoo/UglifyJS#compress-options
            new UglifyJsPlugin({
                // 默认js
                test: /\.js(\?.*)?$/i,
                exclude: /\.min\.js$/,
                // 开启 sourceMap
                sourceMap: true,
                // 启用文件缓存
                cache: true,
                // 推荐，开启多线程（可设置运行线程数量）
                parallel: true,
                // 配置项
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        unused: true,
                        drop_console: true,
                        drop_debugger: true,
                        reduce_vars: true
                    },
                    output: {
                        comments: false
                    }
                },
                // 是否把注释提到单独的文件中（[name].[ext].LICENSE）
                extractComments: false
            })
        ]
    },
    plugins: [
        // 自动清理 dist 文件夹
        // https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional
        new CleanWebpackPlugin({
            verbose: true,
            dry: false,
            cleanOnceBeforeBuildPatterns: ["**/*", "!vendor/**"]
        }),
    ],
    performance:{
        hints: false
    }
});