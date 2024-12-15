import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";
import { fileURLToPath } from 'url';
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = merge(commonConfig, {
    mode: "production",
    output: {
        path: path.join(__dirname,"client/dist"),
        filename: "index_bundle_[contenthash].js"
    }
})

export default config;