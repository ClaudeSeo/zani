const path = require("path");
const slsw = require('serverless-webpack');

module.exports = {
    mode: slsw.lib.options.stage,
    entry: slsw.lib.entries,
    output: {
        libraryTarget: "commonjs",
        filename: '[name].js',
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
};
