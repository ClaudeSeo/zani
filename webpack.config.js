const path = require("path");
const webpack = require('webpack');
const slsw = require('serverless-webpack');

const stage = slsw.lib.options.stage !== 'development' ? 'production' : 'development';

module.exports = {
    mode: stage,
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
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            ...slsw.lib.serverless.service.provider.environment,
        })
    ]
};
