import { ruleSchedule } from "./types.js";

const validateScheduleData = (obj: ruleSchedule): boolean => {
    return (obj.name && obj.start && obj.end) ? true : false;
}

const extractScheduleTime = (value: string, unit: "hour" | "minute"): string => {
    if (unit === "hour") return value.slice(0, 2);
    else if (unit === "minute") return value.slice(3);
    else return "00";
}

const assembleScheduleTime = (hour: number, minute: number): string => {
    let timeString = "";
    if (hour.toString().length === 1) {
        timeString += `0${hour}`;
    } else {
        timeString += hour;
    }
    timeString += ":";
    if (minute.toString().length === 1) {
        timeString += `0${minute}`;
    } else {
        timeString += minute;
    }
    return timeString; // "hh:mm"
}

export { validateScheduleData, extractScheduleTime, assembleScheduleTime };