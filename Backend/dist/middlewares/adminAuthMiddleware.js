"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = require("../constants/httpStatusCode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        res
            .status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
            .json({ success: false, message: "Unauthorized" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "defaultSecret");
        req.user = decoded;
        next();
    }
    catch (err) {
        res
            .status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
            .json({ success: false, message: "Invalid token" });
    }
};
exports.default = authMiddleware;
