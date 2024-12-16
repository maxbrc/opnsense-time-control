import React, { useState, useEffect } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import "../styles/Selector.css";
import { AlertType} from "../types";

function Selector({ accessStatus, onStateChange, doAlert }: { accessStatus: boolean, onStateChange: () => void, doAlert: (alertType: AlertType, alertText: string) => void}) {
    // I should probably move this state up as well, but App is already cluttered
    const setAccessState = async (state: string) => {
        if (accessStatus.toString() !== state) {
            try {
                const res = await fetch(`${process.env.APPLICATION_URL}status/${state}`, {
                    method: "POST",
                    headers: { Accept: "application/json" }
                })
                //const json = await res.json() // TO BE HANDLED
                doAlert("success", `Internet Access was successfully turned ${state === "true" ? "on" : "off"}.`)
                onStateChange()
            } catch (e) {
                console.log("Error while setting access!", (e as Error).message)
            }
        } else {
            doAlert("info", `Access is already ${state === "true" ? "on" : "off"}.`)
        }
    }

    const [ access, setAccess ] = useState(accessStatus.toString());
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccess(event.target.value);
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
                <Button onClick={() => {setAccessState(access);}} variant="outlined" startIcon={<SettingsIcon />} sx={{color: "black", borderColor: "black"}}>Set Access</Button>
            </div>
        </>
    )
}

export default Selector;