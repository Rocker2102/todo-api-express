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
    let userId = req.params.identifier.trim();

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
    let username = req.params.identifier.trim();

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
            res.status(404).json({
                error: true,
                message: "User not found!"
            });
        }
    });
}

exports.updateUser = (req, res) => {
    let userId = res.locals.userId;
    let name = req.body.name.trim();
    let username = req.body.username.trim();

    User.findByIdAndUpdate(userId, {
        name: name,
        username: username
    }, (err, doc) => {
        if (err) {
            res.status(503).json({
                error: true,
                info: err,
                message: "An error occurred!"
            });
        } else if (doc) {
            res.json({
                error: false,
                message: "Details updated!"
            });
        } else {
            res.status(400).json({
                error: true,
                message: "Failed to process request!"
            });
        }
    });
}

exports.deleteUser = (req, res) => {
    let userId = res.locals.userId;
    let password = util.sha256(req.body.password.trim(), process.env.HASH_SALT);

    User.findOne({_id: userId, password: password}, (err, doc) => {
        if (err) {
            res.status(503).json({
                error: true,
                info: err,
                message: "An error occurred!"
            });
        } else if (doc) {
            User.findByIdAndDelete(userId, (err) => {
                if (err) {
                    res.status(503).json({
                        error: true,
                        info: err,
                        message: "An error occurred!"
                    });
                } else {
                    res.json({
                        error: false,
                        message: "Account deleted!"
                    });
                }
            });
        } else {
            res.status(400).json({
                error: true,
                message: "Failed to process request!"
            });
        }
    });
}
