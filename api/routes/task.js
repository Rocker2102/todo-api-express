"use strict";

const router = require("express").Router();
const util = require("../utils");
const taskController = require("../controllers/task-controller");
const auth = require("../controllers/auth");

/* GET request to get items */
router.route("/get").get(auth.authMiddleware, taskController.getTasks);

/* POST request to add items */
router.route("/add").post(auth.authMiddleware, (req, res, next) => {
    const requiredKeys = ["task", "dueDate"];

    if (!util.checkKeys(req.body, requiredKeys)) {
        return res.status(400).json({
            error: true,
            message: "Required parameter missing or invalid!"
        });
    } else {
        next();
    }
}, taskController.addTask);

/* PUT request to update items */
router.route("/:taskId/update").put(auth.authMiddleware, (req, res, next) => {
    const requiredKeys = ["task", "dueDate"];

    if (!util.checkKeys(req.body, requiredKeys)) {
        return res.status(400).json({
            error: true,
            message: "Required parameter missing or invalid!"
        });
    } else {
        next();
    }
}, taskController.updateTask);

/* DELETE request to delete items */
router.route("/:taskId/delete").delete(auth.authMiddleware, taskController.deleteTask);

module.exports = router;
