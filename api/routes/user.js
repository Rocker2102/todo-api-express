"use strict";

const router = require("express").Router();
const util = require("../utility/functions");
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
    console.log(`Connected to MongoDB (${process.env.MONGO_URI})`);
});

const validateUserData = (req, res, next) => {
    const requiredKeys = ["name", "username", "password", "confirmPassword"];

    if (!util.checkKeys(req.body, requiredKeys)) {
        return res.status(400).json({
            error: true,
            message: "Required parameter missing or invalid!"
        });
    } else if (req.body.confirmPassword !== req.body.password) {
        return res.status(400).json({
            error: true,
            message: "Passwords do not match!"
        });
    } else {
        next();
    }
}

/* POST request to add user */
router.route("/").post(validateUserData, (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({username: username}, (err, result) => {
        if (err) {
            res.status(503).json({
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
            password = util.sha256(password);
            const newUser = new User({
                name, username, password
            });

            newUser.save()
                .then(() => res.json({
                    error: false,
                    message: "Account Created"
                }))
                .catch((err) => {
                    res.status(400).json({
                        error: true,
                        info: err,
                        message: "An error occurred!"
                    });
                });
        }
    });
});

/* GET request to get user info. */
router.route("/:id").get((req, res, next) => {
    if (req.params.id) {
        next();
    } else {
        res.send("User ID or username required!");
    }
}, (req, res, next) => {
    let userId = req.params.id.trim();

    User.findById(userId, (err, result) => {
        if (result) {
            result.password = null;
            res.status(200).json(result);
        } else {
            next();
        }
    });
}, (req, res) => {
    let username = req.params.id.trim();

    User.findOne({username: username}, (err, result) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "An error occurred!",
                info: err
            });
        } else if (result) {
            result.password = null;
            res.status(200).json(result);
        } else {
            res.status(404).send("User not found!");
        }
    });
});

module.exports = router;
