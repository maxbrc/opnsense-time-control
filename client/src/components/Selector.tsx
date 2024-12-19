import React, { useState, useEffect } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import "../styles/Selector.css";
import { AlertType, BackendPostRes } from "../types";

function Selector({ accessStatus, onStateChange, doAlert }: { accessStatus: boolean, onStateChange: () => Promise<void>, doAlert: (alertType: AlertType, alertText: string) => void}) {
    // I should probably move this state up as well, but App is already cluttered
    const setAccessState = async (state: "true" | "false"): Promise<void> => {
            try {
                if (accessStatus.toString() !== state) {
                    const res = await fetch(`${window.location.origin}status/${state}`, {
                        method: "POST",
                        headers: { Accept: "application/json" }
                    })
                    const json: BackendPostRes = await res.json();
                    if (json.status === "ok") {
                        doAlert("success", `Internet access was successfully turned ${state === "true" ? "on" : "off"}.`)
                    } else if (json.status === "error") {
                        doAlert("error", `Error in backend: access could not be set: ${json.content}`);
                    } else {
                        throw new Error("Unexpected response from backend!")
                    }
                    await onStateChange()
                } else {
                    doAlert("info", `Access is already ${state === "true" ? "on" : "off"}.`)
                }
            } catch (e) {
                console.log("Error while setting access:", e)
                doAlert("error", `Fatal Error: ${(e as Error).message}`)
            }
        }

    const [ access, setAccess ] = useState<string>(accessStatus.toString());
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccess(event.target.value);
        onStateChange(); // This may be improved, I wanted to put it in setAccessState but somehow it doesn't get awaited properly, no matter what I try
    }
    
    useEffect(() => {
        setAccess(accessStatus.toString());
    }, [accessStatus]);

    return (
        <>
            <div>
                <FormControl>
                    <RadioGroup
                            aria-labelledby="internet_access_switch"
                            name="internet_access_switch"
                            value={access}
                            onChange={handleChange}
                    >
                    <FormControlLabel value="false" control={<Radio />} label="Internet Off" />
                    <FormControlLabel value="true" control={<Radio />} label="Internet On" />
                    </RadioGroup>
                </FormControl>
            </div>
            <div className="buttonWrapper">
                <Button onClick={() => {setAccessState(access as "true" | "false");}} variant="outlined" startIcon={<SettingsIcon />} sx={{color: "black", borderColor: "black"}}>Set Access</Button>
            </div>
        </>
    )
}

export default Selector;