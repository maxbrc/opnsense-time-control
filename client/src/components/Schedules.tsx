import React from "react";
import { ruleSchedule } from "../types";
import Schedule from "./Schedule";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function Schedules({ schedulesArray, addSchedule, removeSchedule }: { schedulesArray: ruleSchedule[], addSchedule: (blankSchedule: ruleSchedule) => void, removeSchedule: (index: number) => void}) {

    const blankSchedule: ruleSchedule = {
        start: "00:00",
        end: "00:00",
        uuid: "",
        enabled: true,
        name: "Schedule Name"
    }

    return (
        <>
            {
                schedulesArray.map((el, idx) => {
                    return <Schedule dbSchedule={el} key={idx} removeSchedule={() => removeSchedule(idx)}/>
                })
            }
            <div className="buttonWrapper">
                <Button onClick={() => addSchedule(blankSchedule)} startIcon={<AddIcon />} variant="outlined" sx={{color: "black", borderColor: "black"}}>Add Schedule</Button>
            </div>
        </>
    )
}

export default Schedules;