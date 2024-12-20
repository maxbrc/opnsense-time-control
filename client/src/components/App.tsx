import React, { useState } from "react";
import { v4 as uuid } from "uuid";

import "../styles/App.css";

import StatusBar from "./StatusBar";
import Selector from "./Selector";
import Schedules from "./Schedules";
import { StatusResponse, ruleSchedule, AppAlert, AlertType, BackendPostRes } from "../types";

import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';

function App() {
    const [ initialDataFetched, setInitialDataFetched ] = useState(false); // will be improved at some point
    const blankSchedule: ruleSchedule = {
        start: "00:00",
        end: "00:00",
        uuid: "",
        enabled: true,
        name: "Placeholder"
    }

    const [ status, setStatus ] = useState<StatusResponse>({} as StatusResponse);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ alerts, setAlerts ] = useState<AppAlert[]>([]);

    const doAlert = (alertType: AlertType, alertText: string): void => {
        const newAlert: AppAlert = {
            type: alertType,
            text: alertText,
            uuid: uuid()
        }
        setAlerts(currAlerts => [...currAlerts, newAlert])
        setTimeout(() => {
            setAlerts(currAlerts => {
                return currAlerts.filter(el => el.uuid !== newAlert.uuid)
            })
        }, alertType === "error" ? 8000 : 5000)
    }

    const addSchedule = async (): Promise<void> => {
        const newSchedule: ruleSchedule = {...blankSchedule, uuid: uuid()};
        setStatus(currStatus => {
            return {
                ...currStatus,
                schedules: [...currStatus.schedules, newSchedule]
            }
        })
        await putSchedule(newSchedule);
    }

    const putSchedule = async (newSchedule: ruleSchedule): Promise<void> => {
        if (JSON.stringify(status.schedules.find(schedule => schedule.uuid === newSchedule.uuid)) !== JSON.stringify(newSchedule)) {
            setStatus(currStatus => {
                return {
                    ...currStatus,
                    schedules: currStatus.schedules.map(el => el.uuid !== newSchedule.uuid ? el : newSchedule)
                }
            });
            try {
                const res = await fetch(`${window.location.origin}/schedules`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newSchedule)
                });
                const json: BackendPostRes = await res.json();
                if (json.status === "ok") {
                    if (status.schedules.find(schedule => schedule.uuid === newSchedule.uuid) === undefined) {
                        doAlert("success", "Schedule was created successfully.");
                    } else {
                        doAlert("success", "Schedule was applied successfully.");
                    }
                } else if (json.status === "error") {
                    doAlert("error", `Error in backend: schedule could not be applied: ${json.content}.`);
                } else {
                    throw new Error("Unexpected response from backend!");
                }
            } catch (e) {
                console.log(e);
                doAlert("error", `Fatal Error: ${(e as Error).message}`);
            }
        } else {
            doAlert("info", "Nothing changed.");
        }
    }

    const removeSchedule = async (scheduleIndex: number): Promise<void> => {
        const scheduleUUID: string = status.schedules[scheduleIndex].uuid;
        try {
            const res = await fetch(`${window.location.origin}/schedules/${scheduleUUID}`, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                }
            })
            const json: BackendPostRes = await res.json();
            if (json.status === "ok") {
                doAlert("success", "Schedule was successfully removed.");
            } else if (json.status === "error") {
                doAlert("error", `Error in backend: schedule could not be removed: ${json.content}`)
            } else {
                throw new Error("Unexpected response from backend!")
            }
        } catch (e) {
            console.log(e);
            doAlert("error", `Fatal Error: ${(e as Error).message}`);
        }
        setStatus(currStatus => {
            return {
                ...currStatus,
                schedules: currStatus.schedules.filter((_, index) => index !== scheduleIndex)
            }
        })
    }

    const fetchStatus = async (): Promise<void> => {
        try {
            const res = await fetch(`${window.location.origin}/status`, {
                headers: { "Accept": "application/json" }
            });
            const json: BackendPostRes = await res.json();
            if (json.status === "ok" && typeof json.content !== "string") {
                setStatus(json.content);
                setIsLoading(false);
            }
            else if (json.status === "error") doAlert("error", `Error in backend: could not fetch status: ${json.content}`);
        } catch (e) {
            console.log(e);
            doAlert("error", (e as Error).message);
        }
    }

    if (!initialDataFetched) {
        fetchStatus();
        setInitialDataFetched(true)
    } // f*** useEffect, it gets called twice (and I know why), but I don't want to deal with it

    if (isLoading) {
        return (
            <>
                <div className="alertWrapper">
                    {
                        alerts.map(el => {
                            return (
                                <Alert severity={el.type} variant="filled" key={el.uuid}>
                                    {el.text}
                                </Alert>
                            )
                        })
                    }
                </div>
                <CircularProgress className="loader"/>
            </>  
        )
    }

    return (
        <>
            <div className="alertWrapper">
                {
                    alerts.map(el => {
                        return (
                            <Alert severity={el.type} variant="filled" key={el.uuid}>
                                {el.text}
                            </Alert>
                        )
                    })
                }
            </div>
            <h1>Internet Control Panel</h1>
            <section className="container">
                <StatusBar text="Firewall" propStatus={status.status.firewall} propStatusType="status"/>
                <StatusBar text="Internet Access" propStatus={status.status.access} propStatusType="boolean"/>
            </section>
            <h2>Access Control</h2>
            <section className="accessSet">
                <Selector accessStatus={status.status.access} onStateChange={fetchStatus} doAlert={doAlert}/>
            </section>
            <h2>Schedules</h2>
            <section className="container">
                <Schedules schedulesArray={status.schedules} addSchedule={addSchedule} removeSchedule={removeSchedule} putSchedule={putSchedule}/>
            </section>
            <section className="container">
                <h2>Other Actions</h2>
                <div className="buttonWrapper">
                    <Button onClick={fetchStatus} startIcon={<RefreshIcon />} variant="outlined" sx={{color: "black", borderColor: "black"}}>Refresh</Button>
                </div>
            </section>
        </>
    )
}

export default App;