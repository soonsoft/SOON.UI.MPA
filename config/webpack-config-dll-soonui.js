const path = require("path");
const webpack = require("webpack");

const CopyPlugin = require("copy-webpack-plugin");
const outputPath = path.join(__dirname, "../dist", "vendor", "soon-ui");

module.exports = {
    mode: "production",
    devtool: "source-map",
    resolve:{
        alias: {
            soonui: path.resolve(__dirname, "../vendor/soon-ui/SOON.UI.3.5.0.all.js")
        },
        extensions: [".js", ".jsx"]
    },
    entry: {
       soonui: ["core-js", "soonui"]
    },
    output: {
        path: outputPath,
        filename: "[name].dll.js",
        library: "[name]_dll_[hash]",
       
    },
    plugins:[
        new webpack.DllPlugin({
            name: "[name]_dll_[hash]",
            path: path.join(outputPath, "[name].manifest.json")
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: path.resolve(__dirname, "../vendor/soon-ui/theme"), 
                    to: path.resolve(__dirname, "../dist/vendor/soon-ui/theme")
                },
                {
                    from: path.resolve(__dirname, "../vendor/font-awesome"),
                    to: path.resolve(__dirname, "../dist/vendor/font-awesome")
                },
                {
                    from: path.resolve(__dirname, "../vendor/content"),
                    to: path.resolve(__dirname, "../dist/content")
                }
            ]
        })
    ],
    performance: {
        hints: false
    }
};