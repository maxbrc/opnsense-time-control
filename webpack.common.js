import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
    entry: "./client/src/index.tsx",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./client/src/index.html"
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