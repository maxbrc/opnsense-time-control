import mongoose from "mongoose";

import { assembleStatusResponse } from "./getters.js";
import { refreshScheduleJob  } from "./setters.js";

(async () => await mongoose.connect("mongodb://127.0.0.1:27017/opnsenseTimeControl"))();
console.log("Connected to DB...");

import app from "./routes.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// === Initial Data Fetching === //

(async function () {
    try {
        const initialStatus = await assembleStatusResponse();
        for (const schedule of initialStatus.schedules) {
            console.log("Creating inital schedule jobs:")
            refreshScheduleJob(schedule.uuid)
        }
        console.log("Initial Data:");
        console.dir(initialStatus);
    } catch (e) {
        console.log(e)
    }
})()

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}...`));