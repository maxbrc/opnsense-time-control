import React, { useState, useEffect } from "react";
import "../styles/App.css"
import StatusBar from "./StatusBar";
import Selector from "./Selector";
import { StatusResponse } from "../types";
import CircularProgress from '@mui/material/CircularProgress';

function App() {
    const [ status, setStatus ] = useState<StatusResponse>({} as StatusResponse);
    const [ isLoading, setIsLoading ] = useState(true);
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
        fetchStatus()
    }, [])

    if (isLoading) {
        return (
            <div>
                <CircularProgress />
            </div>
        )
    }

    return (
        <>
            <h1>Internet Control Panel</h1>
            <section className="status">
                <StatusBar text="Firewall" propStatus={status.status.firewall} propStatusType="status"/>
                <StatusBar text="Internet Access" propStatus={status.status.access} propStatusType="boolean"/>
            </section>
            <h2>Access Control</h2>
            <section className="accessSet">
                <Selector accessStatus={status.status.access} onStateChange={fetchStatus}/>
            </section>
        </>
    )
}

export default App;