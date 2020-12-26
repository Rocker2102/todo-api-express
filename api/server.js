"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const tmpRouter = require("./routes/tmp");
// app.use("/api", tmpRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
