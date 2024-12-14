import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = merge(commonConfig, {
    mode: "development",
    output: {
        path: path.resolve(__dirname, "client/dist"),
        filename: "index_bundle.js"
    }
})

export default config;