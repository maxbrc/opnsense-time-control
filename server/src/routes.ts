import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

import { validateScheduleData } from "./utils.js";
import { assembleStatusResponse } from "./getters.js";
import { accessToggle, putSchedule } from "./setters.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // ES6 Module __dirname workaround

const app = express();
app.use(express.json());
app.use("/", express.static(path.join(__dirname,"../../client/dist/")))

// === GET Routes === //

app.get("/status", async (req, res) => {
    try {
        const response = await assembleStatusResponse();
        res.json(response);
    } catch (e) {
        res.json({ status: "error", message: (e as Error).message });
    }
    
})

// === POST Routes === //

app.post("/status/:state", async (req, res) => {
    const { state } = req.params;
    try {
        if (state !== "false" && state !== "true") throw new Error("Invalid request parameters received!");
        await accessToggle(state);
        res.json({ status: "ok", message: "" });
    } catch (e) {
        res.json({ status: "error", message: (e as Error).message });
    }
})

app.post("/schedules", async (req, res) => {
    console.log("Received Schedule POST Request:");
    console.dir(req.body);
    if (validateScheduleData(req.body)) {
        putSchedule(req.body);
        res.json({ status: "ok", message: "" });
    } else {
        res.json({ status: "error", message: "Invalid schedule data." })
    }
})

export default app;