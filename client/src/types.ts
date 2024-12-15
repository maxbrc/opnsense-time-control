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