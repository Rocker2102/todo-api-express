"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 80;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* middleware to log all requests */
app.use((req, res, next) => {
    let date = new Date();
    let formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(`${formattedDate} [${req.method}] ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    next();
});

/* importing routers */
const userRouter = require("./routes/user");
const tokenRouter = require("./routes/token");
const taskRouter = require("./routes/task");

/* using the imported routers */
app.use("/api/user", userRouter);
app.use("/api/token", tokenRouter);
app.use("/api/task", taskRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
