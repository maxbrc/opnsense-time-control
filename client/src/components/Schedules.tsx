import React from "react";
import { ruleSchedule } from "../types";
import Schedule from "./Schedule";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function Schedules({ schedulesArray, addSchedule, removeSchedule, putSchedule }: { schedulesArray: ruleSchedule[], addSchedule: () => Promise<void>, removeSchedule: (index: number) => void, putSchedule: (newSchedule: ruleSchedule) => void}) {

    return (
        <>
            {
                schedulesArray.map((el, idx) => {
                    const uniqueKey = el.start + el.end // This is admittedly terrible but it fixes the bug (will fix later)
                    return <Schedule dbSchedule={el} key={uniqueKey} removeSchedule={() => removeSchedule(idx)} putSchedule={putSchedule}/>
                })
            }
            <div className="buttonWrapper">
                <Button onClick={addSchedule} startIcon={<AddIcon />} variant="outlined" sx={{color: "black", borderColor: "black"}}>Add Schedule</Button>
            </div>
        </>
    )
}

export default Schedules;