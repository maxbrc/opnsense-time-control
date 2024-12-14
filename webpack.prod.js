import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";

const config = merge(commonConfig, {
    mode: "production",
    output: {
        path: "./client/dist",
        filename: "index_bundle_[contenthash].js"
    }
})

export default config;