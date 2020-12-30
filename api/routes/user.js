"use strict";

const router = require("express").Router();
const util = require("../utils");
const userController = require("../controllers/user-controller");

/* POST request to add user */
router.route("/").post((req, res, next) => {
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
}, userController.createUser);

/* GET request to get user info. */
router.route("/:identifier").get((req, res, next) => {
    if (req.params.identifier) {
        next();
    } else {
        res.status(400).send("User ID or username required!");
    }
}, userController.getUserById, userController.getUserByUsername);

/*PUT request to update user */
router.route("/:userId/update").put((req, res, next) => {
    const requiredKeys = ["name", "username"];

    if (!util.checkKeys(req.body, requiredKeys)) {
        return res.status(400).json({
            error: true,
            message: "Required parameter missing or invalid!"
        });
    } else {
        next();
    }
}, userController.updateUser);

/* DELETE request to delete user */
router.route("/:userId/delete").delete((req, res, next) => {
    const requiredKeys = ["password"];

    if (!util.checkKeys(req.body, requiredKeys)) {
        return res.status(400).json({
            error: true,
            message: "Required parameter missing or invalid!"
        });
    } else {
        next();
    }
}, userController.deleteUser);

module.exports = router;
