import { config } from 'dotenv-safe';
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // ES6 Module __dirname workaround
config({
    path: path.join(__dirname,"../../.env"),
    example: path.join(__dirname,"../../.env.example")
});
const credentials = Buffer.from(process.env.KEY + ":" + process.env.SECRET).toString("base64");
const ruleUUID = process.env.RULEUUID;

export { credentials, ruleUUID };