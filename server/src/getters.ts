import { assembleScheduleTime } from "./utils.js";
import { Schedule } from "./schema.js";
import { credentials, ruleUUID } from "./credentials.js";
import { ruleSchedule } from "./types.js";
let accessEnabled: boolean;

const accessInfo = async () => {
    try {
        const res = await fetch(`${process.env.OPNSENSE_URL}api/firewall/filter/getRule/${ruleUUID}`, {
            headers: {
                "Accept": "application/json",
                "Authorization": "Basic " + credentials,
            }
        });
        const json = await res.json();
        const ruleEnabled = json.rule.enabled;
        if (ruleEnabled === "0") {
            accessEnabled = true;
            return true; // Access is enabled
        } else if (ruleEnabled === "1") {
            accessEnabled = false;
            return false; // Access is disabled
        } else {
            throw new Error("Error while reading rule properties!");
        }
    } catch (e) {
        console.log("Error while fetching access info from firewall: " + e);
        throw new Error((e as Error).message);
    }
}

const checkFirewallStatus = async () => {
    try {
        const res = await fetch(`${process.env.OPNSENSE_URL}api/core/system/status`, {
            headers: {
                "Accept": "application/json",
                "Authorization": "Basic " + credentials,
            }
        });
        const json = await res.json();
        if (json.System !== undefined) {
            return json.System.status === "OK"
        } else {
            throw new Error("Reading system status from firewall failed!")
        }
    } catch (e) {
        console.log("Error fetching status: " + e);
        throw new Error((e as Error).message);
    }   
}

interface StatusResponse {
    status: {
        firewall: boolean;
        access: boolean;
    };
    schedules: ruleSchedule[];
}

const assembleStatusResponse = async (): Promise<StatusResponse> => {
    const response: StatusResponse = {
        status: {
            firewall: false,
            access: false
        },
        schedules: []
    }
    try {
        const firewallStatus = await checkFirewallStatus();
        response.status.firewall = firewallStatus;

        const accessStatus = await accessInfo();
        response.status.access = accessStatus;

        const emptySchedule: ruleSchedule = {
            start: "",
            end: "",
            uuid: "",
            enabled: false,
            name: ""
        }
        const storedSchedules = await Schedule.find({})
        for (let i = 0; i < storedSchedules.length; i++) {
            const schedule = storedSchedules[i];
            response.schedules[i] = {...emptySchedule};
            response.schedules[i].start = assembleScheduleTime(schedule.start.hour, schedule.start.minute);
            response.schedules[i].end = assembleScheduleTime(schedule.end.hour, schedule.end.minute);
            response.schedules[i].enabled = schedule.enabled;
            response.schedules[i].name = schedule.name;
            response.schedules[i].uuid = schedule.uuid;
        }
        return response;
    } catch (e) {
        console.log("Error while assembling status response: " + e)
        throw new Error((e as Error).message)
    }
}

export { assembleStatusResponse, accessInfo, accessEnabled };