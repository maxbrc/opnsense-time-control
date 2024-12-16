import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

import "../styles/App.css";

import StatusBar from "./StatusBar";
import Selector from "./Selector";
import Schedules from "./Schedules";
import { StatusResponse, ruleSchedule } from "../types";

import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

function App() {
    const blankSchedule: ruleSchedule = {
        start: "00:00",
        end: "00:00",
        uuid: "",
        enabled: true,
        name: "Placeholder"
    }

    const [ status, setStatus ] = useState<StatusResponse>({} as StatusResponse);
    const [ isLoading, setIsLoading ] = useState(true);

    const addSchedule = async () => {
        const newSchedule = {...blankSchedule, uuid: uuid()};
        await putSchedule(newSchedule);
        setStatus(currStatus => {
            return {
                ...currStatus,
                schedules: [...currStatus.schedules, newSchedule]
            }
        })
    }

    const putSchedule = async (newSchedule: ruleSchedule) => {
        try {
            const res = await fetch(`${process.env.APPLICATION_URL}schedules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newSchedule)
            });
            //const json = await res.json(); // TO BE HANDLED
        } catch (e) {
            console.log((e as Error).message)
        }
    }

    const removeSchedule = (scheduleIndex: number): void => {
        const scheduleUUID = status.schedules[scheduleIndex].uuid;
        if (scheduleUUID) {
            fetch(`${process.env.APPLICATION_URL}schedules/${scheduleUUID}`, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                }
            })
        }
        setStatus(currStatus => {
            return {
                ...currStatus,
                schedules: currStatus.schedules.filter((el, index) => index !== scheduleIndex)
            }
        })
    }

    async function fetchStatus() {
        try {
            const res = await fetch(`${process.env.APPLICATION_URL}status`, {
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