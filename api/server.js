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

const userRouter = require("./routes/user");
app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
