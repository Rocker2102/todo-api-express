const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    task: { type: String, required: true },
    dueDate: { type: Date, required: true }
}, { timestamps: true });

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
