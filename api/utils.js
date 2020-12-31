"use strict";

const crypto = require("crypto");

const INIT_VECTOR = Buffer.from("f388e70af54b9e0ce5f036831a7d537b", "hex"); /* Initialization Vector */
const ENC_ALGO = "aes-256-ctr"; /* Encryption/decryption algo */

const getRandomInteger = (max, min = 0) => {
    max += 1; /* else max will never occur */
    return (Math.floor(Math.random() * (max - min)) + min);
}

const processEncKey = (actualKey) => {
    return crypto.createHash("sha256").update(actualKey).digest("base64").substr(0, 32);
}

exports.sha256 = (str, hashSalt = "") => {
    str = (hashSalt) ? str + hashSalt : str;
    let data = crypto.createHash("sha256").update(str, "utf-8");
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

exports.getRandomStr = (len = 6, mixMode = 6) => {
    const numArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const charArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const specialArr = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]", ":", ";", "<", ">", ".", "?", "/", "|", "~"];
    let tmpArr = [];
    let randomStr = "";

    switch (mixMode) {
        case 6: tmpArr = [...numArr, ...charArr]; break;
        case 7: tmpArr = [...numArr, ...charArr, ...specialArr]; break;
        case 4: tmpArr = numArr; break;
        case 2: tmpArr = charArr; break;
        case 5: tmpArr = [...numArr, ...specialArr]; break;
        case 3: tmpArr = [...charArr, ...specialArr]; break;
        case 1: tmpArr = specialArr;
        default: tmpArr = [...numArr, ...charArr, ...specialArr]; break;
    }

    for (let i = 0; i < len; i++) {
        let randomIndex = getRandomInteger(tmpArr.length - 1);
        randomStr += String(tmpArr[randomIndex]);
    }

    return randomStr;
}


exports.encryptStr = (str, key = process.env.ENC_KEY) => {
    const cipher = crypto.createCipheriv(ENC_ALGO, key, INIT_VECTOR);
    const encrypted = Buffer.concat([cipher.update(str), cipher.final()]);
    return encrypted.toString("hex");
}

exports.decryptStr = (str, key = process.env.ENC_KEY) => {
    const decipher = crypto.createDecipheriv(ENC_ALGO, key, INIT_VECTOR);
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(str, "hex")), decipher.final()]);
    return decrpyted.toString();
}
