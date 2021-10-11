// const path = require("path");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const glob = require("glob");
// const HtmlWebPackPlugin = require("html-webpack-plugin");
//
//
// module.exports = {
//     mode: 'none',
//     entry: {
//         "application.js": glob.sync("build/static/?(js|css)/*.?(js|css)").map(f => path.resolve(__dirname, f)),
//     },
//     output: {
//         filename: "build/static/js/application.js",
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.css$/,
//                 use: ["style-loader", "css-loader"],
//             },
//         ],
//     },
//     plugins: [

//         new UglifyJsPlugin(),
//         new CompressionPlugin({
//             filename: asset => 'build/static/js/application.min.js',
//             algorithm: "gzip",
//             test: /\.js$|/,
//             threshold: 0,
//             minRatio: 0.8,
//             deleteOriginalAssets: false
//         })
//     ],
// };

const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                "targets": "defaults"
                            }],
                            '@babel/preset-react'
                        ]
                    }
                }]
            },
            {
                include: path.resolve(__dirname, 'src'),
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: 'src/index.html',
            filename: './index.html' //relative to root of the application
        }),
    ]
};