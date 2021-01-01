"use strict";

const util = require("../utils");
require("./mongo-db");
let User = require("../models/users.model");
const auth = require("./auth");

exports.getToken = (req, res) => {
    let username = req.body.username.trim();
    let password = util.sha256(req.body.password.trim(), process.env.HASH_SALT);

    User.findOne({username: username, password: password}, (err, doc) => {
        if (err) {
            res.status(503).json({
                error: true,
                info: err,
                message: "An error occurred!"
            });
        } else if (doc) {
            res.json({
                error: false,
                message: "Token granted",
                data: auth.getToken(doc._id)
            });
        } else {
            res.status(400).json({
                error: true,
                message: "Invalid credentials!",
                password: password
            });
        }
    });
}
