"use strict";

exports.sha256 = (str, hashSalt = "") => {
    str = (hashSalt) ? str + hashSalt : str;
    let data = require("crypto").createHash("sha256").update(str, "utf-8");
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
