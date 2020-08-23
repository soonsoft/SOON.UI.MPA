const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取js中的css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//  环境变量
const env = process.env.NODE_ENV;

const htmlPlugins = [];
const entries = {};

const pages = require("./page-config");

pages.forEach(page => {
    const name = page.name;
    const layout = page.layout || "layout.ejs";
    const title = page.title || page.name;
    
    const js = page.js;
    let url = page.url;
    if(!url) {
        url = js.substring(0, js.lastIndexOf("/"));
    }

    let htmlPlugin = new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: path.resolve(__dirname, `../src/template/${layout}`),
        title: title,
        chunks: [name]
    });
    htmlPlugins.push(htmlPlugin);
    
    //let key = `script/${url}/${name}.js`;
    entries[name] = path.resolve(__dirname, `../src/page/${js}`);
});

module.exports = {
    // 生成一个独立的源代码映射文件
    // 1. source-map 单独文件，代码关联到源文件
    // 2. eval-source-map  集成在 js 文件中  代码关联到源文件
    // 3. cheap-source-map 单独文件 代码关联到编译文件
    devtool: "cheap-source-map", 
    entry: entries,
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].js",
        // publicPath 上线时配置的是cdn的地址
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        attributes: true
                    }
                }]
            },
            {
                // 对 css 后缀名进行处理
                test: /\.css$/,
                // 不处理 node_modules 文件中的 css 文件
                exclude: /(node_modules|vendor)/,
                /* link打包之后引入对应的css形式(dev模式下为内嵌style形式) */
                use: [
                    env === "prod" ? MiniCssExtractPlugin.loader : "style-loader", 
                    "css-loader"
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|vendor)/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                        // 打包生成图片的名字
                        name: "image/[name].[hash].[ext]",
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: false
                    }
                }]
            }
        ]
    },
    resolve: {
        alias: {
            soonui: path.resolve(__dirname, "../vendor/soon-ui/SOON.UI.3.5.0.all.js")
        }
    },
    plugins: [
        ...htmlPlugins,
        // 从js中提取css配置
        new MiniCssExtractPlugin({
            filename: env == "prod" ? "style/[name].[contenthash:8].css" : "[name].css",
            chunkFilename: env == "prod" ? "style/[name].[contenthash:8].css" : "[name].css",
            allChunks: true
        }),
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, ".."),
            manifest: require(path.resolve(__dirname, "../dist/vendor/soon-ui/soonui.manifest.json"))
        })
    ]
};