import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

import { validateScheduleData } from "./utils.js";
import { assembleStatusResponse } from "./getters.js";
import { accessToggle, putSchedule, deleteSchedule, refreshScheduleJob } from "./setters.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // ES6 Module __dirname workaround

const app = express();
app.use(express.json());
app.use("/", express.static(path.join(__dirname,"../../client/dist/")))

// === GET Routes === //

app.get("/status", async (req, res) => {
    try {
        const response = await assembleStatusResponse();
        res.json({ status: "ok", content: response });
    } catch (e) {
        console.log("Error while sending status response to frontend: " + e)
        res.json({ status: "error", content: (e as Error).message });
    }
    
})

// === POST Routes === //

app.post("/status/:state", async (req, res) => {
    const { state }: { state: string } = req.params;
    console.log("Received internet access state change: " + state);
    try {
        if (state !== "false" && state !== "true") throw new Error("Invalid request parameters received!");
        await accessToggle(state);
        res.json({ status: "ok", content: "" });
    } catch (e) {
        console.log(e)
        res.json({ status: "error", content: (e as Error).message });
    }
})

app.post("/schedules", async (req, res) => {
    console.log("Received Schedule POST Request:");
    console.dir(req.body);
    try {
        if (validateScheduleData(req.body)) {
            await putSchedule(req.body);
            res.json({ status: "ok", content: "" });
        } else {
            throw new Error("Invalid schedule data." );
        }
    } catch (e) {
        console.log(e);
        res.json({ status: "error", content: (e as Error).message })
    }
})

// === (DELETE) Routes === //

app.post("/schedules/:uuid", async (req, res) => {
    const { uuid }: { uuid: string } = req.params;
    console.log("Received Schedule DELETE Request for UUID: " + uuid);
    try {
        await refreshScheduleJob(uuid, true);
        await deleteSchedule(uuid);
        res.json({ status: "ok", content: "" });
    } catch (e) {
        console.log(e);
        res.json({ status: "error", content: (e as Error).message})
    }
})

export default app;