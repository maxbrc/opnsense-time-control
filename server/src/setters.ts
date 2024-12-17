import schedule from "node-schedule";
import { Schedule } from "./schema.js";
import { extractScheduleTime } from "./utils.js";
import { credentials, ruleUUID } from "./credentials.js";
import { accessInfo, accessEnabled } from "./getters.js";
import { ruleSchedule, ruleScheduleModel } from "./types.js";

interface ScheduleJobs {
    startJob: schedule.Job,
    endJob: schedule.Job
}

interface Time {
    hour: number;
    minute: number;
}

const scheduleJobs: {[key: string]: ScheduleJobs} = {};

const scheduleJob = (uuid: string, start: Time, end: Time): void => {
    scheduleJobs[uuid] = {} as ScheduleJobs;
    const startJob = schedule.scheduleJob({tz: "Europe/Berlin", hour: start.hour, minute: start.minute, second: 0}, async (): Promise<void> => {
        console.log("Start time is there!");
        try {
            await accessToggle("false")
            console.log("Access was turned off successfully...");
        } catch (e) {
            console.log("Failed to turn off access: " + e);
        }
        
    })
    const endJob = schedule.scheduleJob({tz: "Europe/Berlin", hour: end.hour, minute: end.minute, second: 0}, async (): Promise<void> => {
        console.log("End time is there!");
        try {
            await accessToggle("true");
            console.log("Access was turned on successfully...");
        } catch (e) {
            console.log("Failed to turn on access: " + e);
        }
    })
    scheduleJobs[uuid].startJob = startJob;
    scheduleJobs[uuid].endJob = endJob;
    console.log("Successfully created jobs for uuid: " + uuid);
}

const refreshScheduleJob = async (uuid: string, remove: boolean): Promise<void> => {
    console.log("Refreshing schedule jobs for uuid: " + uuid);
    try {
        const [ schedule ] = await Schedule.find({ uuid: uuid });
        if (scheduleJobs[uuid]) {
            scheduleJobs[uuid].startJob.cancel();
            scheduleJobs[uuid].endJob.cancel();
            console.log("Canceled existing jobs.");
        }
        if (schedule.enabled && !remove) {
            console.log("Creating new jobs...")
            scheduleJob(
                uuid,
                {
                    hour: schedule.start.hour,
                    minute: schedule.start.minute
                },
                {
                    hour: schedule.end.hour,
                    minute: schedule.end.minute
                });
        } else {
            console.log("Schedule is disabled, not creating new jobs.")
        }
    } catch (e) {
        console.log(e);
        throw new Error((e as Error).message);
    }
}

const accessToggle = async (state: "true" | "false"): Promise<void> => {
    try {
        if (accessEnabled.toString() !== state) {
            const res = await fetch(`${process.env.OPNSENSE_URL}api/firewall/filter/toggleRule/${ruleUUID}/`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Basic " + credentials,
                },
            });
            const json = await res.json();
            await fetch(`${process.env.OPNSENSE_URL}api/firewall/filter/apply`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Basic " + credentials,
                }
            })
            const { result }: { result: "Enabled" | "Disabled" } = json;
            if (result !== "Enabled" && result !== "Disabled") throw new Error("Unexpected response from firewall!");
            await accessInfo();
        } else {
            throw new Error("State already set!"); // This is not directly an error. I will be fixing that.
        }
    } catch (e) {
        console.log(e);
        throw new Error((e as Error).message);
    }
}

const putSchedule = async (requestBody: ruleSchedule) => {
    const { start, end, ...rest } = requestBody;
    const newSchedule: ruleScheduleModel = { start: {}, end: {}, ...rest} as ruleScheduleModel;
    newSchedule.start.hour = extractScheduleTime(start, "hour");
    newSchedule.start.minute = extractScheduleTime(start, "minute");
    newSchedule.end.hour = extractScheduleTime(end, "hour");
    newSchedule.end.minute = extractScheduleTime(end, "minute");
    try {
        await Schedule.updateOne({ uuid: newSchedule.uuid }, newSchedule, { upsert: true });
        await refreshScheduleJob(newSchedule.uuid, false);
    } catch (e) {
        console.log(e);
        throw new Error((e as Error).message);
    }
}

const deleteSchedule = async (scheduleUUID: string) => {
    await Schedule.deleteOne({uuid: scheduleUUID});
}

export { refreshScheduleJob, accessToggle, putSchedule, deleteSchedule };