"use strict";

const router = require('express').Router();
const mongoose = require("mongoose");
let User = require("../models/users.model");

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
    console.log("MongoDB database connection established successfully");
});

/* POST request to add user */
router.route("/").post((req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    const newUser = new User({
        name, username, password
    });

    User.findOne({username: username}, (err, result) => {
        if (err) {
            res.status(400).json({
                error: true,
                info: err,
                message: "An error occurred!"
            });
        } else if (result) {
            res.status(409).json({
                error: true,
                message: "Username already taken!"
            });
        } else {
            newUser.save()
                .then(() => res.json({message: "Account Created"}))
                .catch((err) => {
                    return res.status(400).json({
                        error: true,
                        info: err,
                        message: "An error occurred!"
                    });
                });
        }
    });
});

/* GET request to get user info. */
router.route("/").get((req, res) => {
    let userId = req.params["user-id"];
    res.send([userId, req.query]);
});

module.exports = router;
