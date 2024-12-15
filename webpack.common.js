import HtmlWebpackPlugin from "html-webpack-plugin";
import DotenvWebpackPlugin from "dotenv-webpack";

const config = {
    entry: "./client/src/index.tsx",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./client/src/index.html"
        }),
        new DotenvWebpackPlugin({
            path: "./.env.common"
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    "ts-loader",
                ],
                exclude: /node_modules/,

            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
}

export default config;