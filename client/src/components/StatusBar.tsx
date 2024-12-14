import React from "react";

function StatusBar({ text, prop }: { text: string, prop: string }) {

    return (
        <div>
            <span>{text}</span>
            <div>
                {propStatus}
            </div>
        </div>
    )
}

export default StatusBar;