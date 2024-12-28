"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateNewToken = (id) => {
    const token = (0, jsonwebtoken_1.sign)({ id: id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_DURATION,
    });
    return token;
};
exports.generateNewToken = generateNewToken;
//# sourceMappingURL=token.js.map