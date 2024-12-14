import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    start: {
        type: {
            hour: {
                type: Number,
                required: true
            },
            minute: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    end: {
        type: {
            hour: {
                type: Number,
                required: true
            },
            minute: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const Schedule = mongoose.model("Schedule", scheduleSchema); // schedules collection

export { Schedule };