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

/* Logs all requests */
app.use((req, res, next) => {
    let date = new Date();
    let formattedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(`${formattedDate} [${req.method}] ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    next();
});

const userRouter = require("./routes/user");
app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
