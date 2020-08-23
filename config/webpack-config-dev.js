const path = require("path");
const webpack = require("webpack");

const { merge } = require("webpack-merge");
const base = require("./webpack-config-base");



module.exports = merge(base, {
    mode: "development",
    devtool: "source-map",
    // 配置 webpack-dev-server
    devServer: {
        port: 6688,
        // 项目根目录
        contentBase: path.resolve(__dirname, "../dist"),
        inline: true,
        open: true,
        openPage: "home.html",
        disableHostCheck: true,
        // 错误、警告展示设置
        overlay: {
            warnings: true,
            errors: true
        },
        // 配置在命令行中出现的提示信息
        stats: {
            all: false,
            hash: true,
            timings: true,
            version: true,
            modules: true,
            maxModules: 0,
            errors: true,
            warnings: true,
            moduleTrace: true,
            errorDetails: true
        }
    }
});