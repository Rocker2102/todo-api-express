const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    username: { type: String, required: true },
    tokens: { type: Array }
}, {
    timestamps: true,
    collection: "access_tokens"
});

const AccessToken = mongoose.model("access_tokens", tokenSchema);

module.exports = AccessToken;
