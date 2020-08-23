const path = require("path");
const webpack = require("webpack");

module.exports = {
    resolve:{
        alias: {
            soonui: path.resolve(__dirname, "../vendor/soon-ui/SOON.UI.3.0.0.all.js")
        },
        extensions: [".js", ".jsx"]
    },
    entry: {
       cloudatlas: ["jquery", "soonui"]
    },
    output: {
        path: path.join(__dirname, "../dist", "dll"),
        filename: "[name].dll.js",
        library: "[name]_dll_[hash]",
       
    },
    plugins:[
        new webpack.DllPlugin({
            name: "[name]_dll_[hash]",
            path:path.join(__dirname, "../dist", "dll", "[name].manifest.json")
        })
    ]
};