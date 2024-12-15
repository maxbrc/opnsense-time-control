import React from "react";
import "../styles/TimePicker.css";

function TimePicker({ value, label, setScheduleTime }: { value: string, label: string, setScheduleTime: (timeValue: string) => void }) {
    const shortLabel = label.toLowerCase().replace(/\s/g, "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setScheduleTime(event.target.value);
    }

    return (
        <div className="timePicker">
            <label htmlFor={label}>{label}</label>
            <input type="time" value={value} id={label} onChange={handleChange}/>
        </div>
    )
}

export default TimePicker;