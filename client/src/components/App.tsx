import React, { useState, useEffect } from "react";
import "../styles/App.css";
import StatusBar from "./StatusBar";
import Selector from "./Selector";
import Schedules from "./Schedules";
import { StatusResponse, ruleSchedule } from "../types";
import CircularProgress from '@mui/material/CircularProgress';



function App() {
    const [ status, setStatus ] = useState<StatusResponse>({} as StatusResponse);
    const [ isLoading, setIsLoading ] = useState(true);

    const addSchedule = (blankSchedule: ruleSchedule): void => {
        setStatus(currStatus => {
            return {
                ...currStatus,
                schedules: [...currStatus.schedules, blankSchedule]
            }
        })
    }

    const removeSchedule = (scheduleIndex: number): void => {
        setStatus(currStatus => {
            return {
                ...currStatus,
                schedules: currStatus.schedules.filter((el, index) => index !== scheduleIndex)
            }
        })
    }

    async function fetchStatus() {
        try {
            const res = await fetch("http://localhost:3000/status", {
                headers: { "Accept": "application/json" }
            });
            const json = await res.json();
            if (typeof json !== "undefined") {
                setStatus(json);
            } else {
                throw new Error("Fetching status failed!");
            }
        } catch (e) {
            console.log((e as Error).message);
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        fetchStatus();
    }, [])

    if (isLoading) {
        return (
            <CircularProgress className="loader"/>
        )
    }

    return (
        <>
            <h1>Internet Control Panel</h1>
            <section className="container">
                <StatusBar text="Firewall" propStatus={status.status.firewall} propStatusType="status"/>
                <StatusBar text="Internet Access" propStatus={status.status.access} propStatusType="boolean"/>
            </section>
            <h2>Access Control</h2>
            <section className="accessSet">
                <Selector accessStatus={status.status.access} onStateChange={fetchStatus}/>
            </section>
            <h2>Schedules</h2>
            <section className="container">
                <Schedules schedulesArray={status.schedules} addSchedule={addSchedule} removeSchedule={removeSchedule}/>
            </section>
        </>
    )
}

export default App;