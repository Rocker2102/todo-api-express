const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true,
    collection: "users"
});

const User = mongoose.model("users", userSchema);

module.exports = User;
