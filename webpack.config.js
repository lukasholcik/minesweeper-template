"use strict";

var path = require("path");
var webpack = require("webpack");
var serve = path.join(__dirname, ".tmp/serve");
var context = path.join(__dirname, "src");

module.exports = {
    context: context,
    entry: [
        "webpack/hot/dev-server",
        "webpack-hot-middleware/client",
        "./styles/main.less",
        "./index.ts"
    ],
    resolve: {
        extensions: ["", ".ts", ".js"]
    },
    module: {
        loaders: [
            // typescript
            {test: /\.ts$/, exclude: /(node_modules|lib)/, loader: "ng-annotate!ts"},

            // stylesheets
            {test: /\.less$/, exclude: /(node_modules|lib)/, loader: "style!css?sourceMap!less?sourceMap"},
            {test: /\.css$/, loader: "style!css?sourceMap"},

            // html templates
            {test: /\.html$/, exclude: /(node_modules|lib)/, loader: "raw"},
        ]
    },
    output: {
        path: serve,
        filename: "js/app.js",
        publicPath: "/"
    },
    //devtool: "inline-source-map",
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            angular: "angular"
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    /**
     * jQuery and angular will be provided from global variables
     */
    externals: {
        "jquery": "jQuery",
        "angular": "angular"
    },
    colors: true
};
