const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const glob = require("glob");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = {
    mode: 'none',
    entry: {
        "application.js": glob.sync("build/static/?(js|css)/*.?(js|css)").map(f => path.resolve(__dirname, f)),
    },
    output: {
        filename: "build/static/js/application.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new UglifyJsPlugin(),
        new CompressionPlugin({
            filename: asset => 'build/static/js/application.min.js',
            algorithm: "gzip",
            test: /\.js$|/,
            threshold: 0,
            minRatio: 0.8,
            deleteOriginalAssets: false
        })
    ],
};