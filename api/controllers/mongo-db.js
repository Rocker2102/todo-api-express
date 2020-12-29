"use strict";

const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;
const mongoOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    auth: {
        "authSource": "admin"
    },
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD
};

mongoose.connect(mongoUri, mongoOptions).catch(err => {
    console.log("MongoDB connection failed!", err);
});

const connection = mongoose.connection;

connection.once("open", function() {
    console.log(`Connected to MongoDB (${process.env.MONGO_URI})`);
});

module.exports = mongoose;
