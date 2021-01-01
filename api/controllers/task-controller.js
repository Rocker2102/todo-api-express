"use strict";

require("./mongo-db");
let TaskItem = require("../models/tasks.model");

const SELECT_FIELDS = "_id task dueDate status createdAt";

exports.getTasks = (req, res) => {
    let userId =  res.locals.userId;

    TaskItem.find({ userId: userId }, SELECT_FIELDS, (err, docs) => {
        if (err) {
            res.status(503).json({
                error: true,
                info: err,
                message: "An error occurred!"
            });
        } else if (docs) {
            res.json({
                error: false,
                message: "",
                data: docs
            });
        } else {
            res.status(400).json({
                error: true,
                message: "Failed to process request!"
            });
        }
    });
}

exports.addTask = (req, res) => {
    let userId = res.locals.userId;
    let task = req.body.task.trim();
    let dueDate = req.body.dueDate.trim();

    const newTask = new TaskItem({
        userId, task, dueDate
    });

    newTask.save().then(() => res.json({
            error: false,
            message: "Task added successfully"
        })).catch(err => {
            res.status(400).json({
                error: true,
                info: err,
                message: "An error occurred!"
            });
        });
}

exports.updateTask = (req, res) => {
    let userId = res.locals.userId;
    let taskId = req.params.taskId;
    let task = req.body.task.trim();
    let dueDate = new Date(req.body.dueDate.trim()).toISOString();

    TaskItem.findOneAndUpdate({ _id: taskId, userId: userId }, {
        task: task,
        dueDate: dueDate
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
                message: "Task updated"
            });
        } else {
            res.status(400).json({
                error: true,
                message: "Failed to process request!"
            });
        }
    });
}

exports.deleteTask = (req, res) => {
    let taskId = req.params.taskId;
    let userId = res.locals.userId;

    TaskItem.findOneAndDelete({ _id: taskId, userId: userId }, (err, doc) => {
        if (err) {
            res.status(503).json({
                error: true,
                info: err,
                message: "An error occurred!"
            });
        } else if (doc) {
            res.json({
                error: false,
                message: "Task deleted"
            });
        } else {
            res.status(400).json({
                error: true,
                message: "Failed to process request!"
            });
        }
    });
}
