import React from "react";
import "../styles/StatusBar.css";
import Chip from "@mui/material/Chip";
import WifiIcon from '@mui/icons-material/Wifi';
import SecurityIcon from '@mui/icons-material/Security';

function StatusBar({ text, propStatus, propStatusType }: { text: string, propStatus: boolean, propStatusType: string }) {
    let label = "";
    if (propStatusType === "status") {
        label = propStatus ? "OK" : "Fault";
    } else if (propStatusType === "boolean") {
        label = propStatus ? "Active" : "Disabled";
    }
    return (
        <div className="bar">
            {text === "Firewall" ? <SecurityIcon /> : <WifiIcon />}
            <span>{text}</span>
            <div>
                <Chip label={label} color={propStatus ? "success" : "warning"} />
            </div>
        </div>
    )
}

export default StatusBar;