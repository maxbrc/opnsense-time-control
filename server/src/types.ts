export interface ruleSchedule {
    start: string,
    end: string,
    uuid: string,
    enabled: boolean,
    name: string
}

export interface ruleScheduleModel {
    uuid: string;
    enabled: boolean;
    start: {
        hour: string;
        minute: string;
    };
    end: {
        hour: string;
        minute: string;
    };
    name: string;
    dow: Number[];
}
// I do not yet know how I can connect this to the Mongo Schema (ignore in compiled version)