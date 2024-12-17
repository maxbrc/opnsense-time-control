import React from "react";
import "../styles/TimePicker.css";

function TimePicker({ value, label, setScheduleTime }: { value: string, label: string, setScheduleTime: (timeValue: string) => void }) {
    const shortLabel: string = label.toLowerCase().replace(/\s/g, "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setScheduleTime(event.target.value);
    }

    return (
        <div className="timePicker">
            <label htmlFor={shortLabel}>{label}</label>
            <input type="time" value={value} id={shortLabel} onChange={handleChange}/>
        </div>
    )
}

export default TimePicker;