import React, { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import "../styles/Selector.css";

function Selector({ accessStatus, onStateChange }: { accessStatus: boolean, onStateChange: () => void }) {
    
    const setAccessState = async (state: string) => {
        if (accessStatus.toString() !== state) {
            try {
                const res = await fetch(`http://localhost:3000/status/${state}`, {
                    method: "POST",
                    headers: { Accept: "application/json" }
                })
                //const json = await res.json() // TO BE HANDLED
                onStateChange()
            } catch (e) {
                console.log("Error while setting access!", (e as Error).message)
            }
        }
    }

    const [ access, setAccess ] = useState(accessStatus.toString());
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("State Change To:"+access)
        setAccess(event.target.value);
        
    }
    
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