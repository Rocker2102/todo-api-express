const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    task: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
        type: String,
        required: true,
        enum: ["done", "due"],
        default: "due"
    }
}, { timestamps: true });

const Task = mongoose.model("task", dataSchema);

module.exports = Task;
