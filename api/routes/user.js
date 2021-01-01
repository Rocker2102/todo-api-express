"use strict";

const router = require("express").Router();
const util = require("../utils");
const userController = require("../controllers/user-controller");
const auth = require("../controllers/auth");

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

/* PUT request to update user */
router.route("/update").put(auth.authMiddleware, (req, res, next) => {
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

/* PUT request to change password */
router.route("/change-password").put(auth.authMiddleware, (req, res, next) => {
    const requiredKeys = ["oldPassword", "newPassword", "confirmPassword"];

    if (!util.checkKeys(req.body, requiredKeys)) {
        return res.status(400).json({
            error: true,
            message: "Required parameter missing or invalid!"
        });
    } else {
        next();
    }
}, userController.changeUserPassword);

/* DELETE request to delete user */
router.route("/delete").delete(auth.authMiddleware, (req, res, next) => {
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
