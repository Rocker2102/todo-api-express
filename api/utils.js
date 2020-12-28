"use strict";

exports.sha256 = str => {
    let hash = require("crypto").createHash("sha256");
    let data = hash.update(str, "utf-8");
    return data.digest("hex");
}

exports.checkKeys = (data, required) => {
    for (let i = 0; i < required.length; i++) {
        if (!data[required[i]]) {
            return false;
        }
    }

    return true;
}
