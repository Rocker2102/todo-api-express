"use strict";

const util = require("../utils");

const TOKEN_EXPIRATION = 60 * 60 * 1000;
const KEY = "kTnf3t7p0b1seJzXjCM5DrT73+w0NiVk";

const validateToken = (token) => {
    let decrypted = "";

    try {
        decrypted = util.decryptStr(token);
        decrypted = JSON.parse(decrypted);
    } catch (e) {
        return false;
    }

    let tokenExp = new Date(decrypted.expires);
    let current = new Date();
    return tokenExp > current;
}

const generateAccessToken = (userId) => {
    let tokenExp = new Date(Date.now() + TOKEN_EXPIRATION);
    const token = {
        userId: userId,
        expires: tokenExp.toISOString()
    }
    return util.encryptStr(JSON.stringify(token));
}

/* this does not validate the token! */
const getUserIdFromToken = (token) => {
    try {
        const decrypted = JSON.parse(util.decryptStr(token));
        return decrypted.userId;
    } catch (e) {
        return "";
    }
}

/* express middleware to check if tokens are present in headers
or not and also validate them */
const authTokenMiddleware = (req, res, next) => {
    const token = req.header("X-Access-Token");

    if (!token) {
        res.status(401).json({
            error: true,
            message: "Access token missing!"
        });
    } else if (!validateToken(token)) {
        res.status(401).json({
            error: true,
            message: "Token invalid or expired!"
        });
    } else {
        res.locals.userId = getUserIdFromToken(token);
        next();
    }
}

module.exports = {
    getToken: generateAccessToken,
    authMiddleware: authTokenMiddleware
}
