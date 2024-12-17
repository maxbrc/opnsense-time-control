import mongoose from "mongoose";

import { assembleStatusResponse } from "./getters.js";
import { refreshScheduleJob  } from "./setters.js";

(async () => await mongoose.connect(process.env.MONGODB_URI!))();
console.log("Connected to DB...");

import app from "./routes.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { port: appPort } = new URL(process.env.APPLICATION_URL!);

// === Initial Data Fetching === //

(async (): Promise<void> => {
    try {
        const initialStatus = await assembleStatusResponse();
        for (const schedule of initialStatus.schedules) {
            console.log("Creating inital schedule jobs:")
            await refreshScheduleJob(schedule.uuid, false)
        }
        console.log("Initial Data:");
        console.dir(initialStatus);
    } catch (e) {
        console.log(e)
    }
})()

app.listen(appPort, (): void => console.log(`Listening on ${appPort}...`));