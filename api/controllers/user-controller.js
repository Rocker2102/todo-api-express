"use strict";

const util = require("../utils");
require("./mongo-db");
let User = require("../models/users.model");

exports.createUser = (req, res) => {
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
            password = util.sha256(password, process.env.HASH_SALT);
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
}

exports.getUserById = (req, res, next) => {
    let userId = req.params.id.trim();

    User.findById(userId, (err, result) => {
        if (result) {
            result.password = null;
            res.status(200).json(result);
        } else {
            next();
        }
    });
}

exports.getUserByUsername = (req, res) => {
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
}
