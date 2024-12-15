import React, { useState } from "react";
import { ruleSchedule } from "../types";
import TimePicker from "./TimePicker";
import Button from '@mui/material/Button';
import LabelIcon from '@mui/icons-material/Label';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import "../styles/Schedule.css";

function Schedule({ dbSchedule, removeSchedule, putSchedule }: { dbSchedule: ruleSchedule, removeSchedule: () => void, putSchedule: (newSchedule: ruleSchedule) => void }) {
    const [ schedule, setSchedule ] = useState(dbSchedule)

    const setScheduleTime = (time: string, value: string) => {
        setSchedule(currSchedule => {
            return {
                ...currSchedule,
                [time]: value
            }
        })
    }

    return (
        <div className="schedules">
            <div className="timeField">
                <TimePicker value={schedule.start} setScheduleTime={(value) => setScheduleTime("start", value)} label="Start Time" />
                <TimePicker value={schedule.end} setScheduleTime={(value) => setScheduleTime("end", value)} label="End Time" /> 
            </div>
            <div className="buttonField">
                <Button onClick={() => putSchedule(schedule)} sx={{color: "black", borderColor: "black", margin: "1em 0 0 0"}} startIcon={<LabelIcon />} variant="outlined">Apply Schedule</Button>
                <Button onClick={removeSchedule} sx={{color: "white", borderColor: "red", backgroundColor: "red", margin: "1em 0 0 0"}} startIcon={<DeleteOutlineIcon />} variant="text">Delete Schedule</Button>
            </div>
        </div>
    )
}

export default Schedule;