"use strict";

const router = require("express").Router();
const util = require("../utils");
const tokenController = require("../controllers/token-controller");

/* POST request to get token */
router.route("/").post((req, res, next) => {
    const requiredKeys = ["username", "password"];

    if (!util.checkKeys(req.body, requiredKeys)) {
        return res.status(400).json({
            error: true,
            message: "Required parameter missing or invalid!"
        });
    } else {
        next();
    }
}, tokenController.getToken);

module.exports = router;
