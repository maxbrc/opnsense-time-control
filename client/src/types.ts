export interface ruleSchedule {
    start: string,
    end: string,
    uuid: string,
    enabled: boolean,
    name: string
}

export interface StatusResponse {
    status: {
        firewall: boolean;
        access: boolean;
    };
    schedules: ruleSchedule[];
}

export type AlertType = "success" | "info" | "warning" | "error";

export interface AppAlert {
    type: AlertType;
    text: string;
    uuid: string;
}