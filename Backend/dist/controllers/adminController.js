"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const httpStatusCode_1 = require("../constants/httpStatusCode");
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const userModel_2 = __importDefault(require("../models/userModel"));
const authValidation_1 = require("../validations/authValidation");
dotenv_1.default.config();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = authValidation_1.signupSchema.validate(req.body);
        if (error) {
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                error: error.details[0].message,
            });
            return;
        }
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res
                .status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
                .json({ success: false, error: "User not found" });
            return;
        }
        if (!user.isAdmin) {
            res
                .status(httpStatusCode_1.HttpStatusCode.FORBIDDEN)
                .json({ success: false, error: "Access denied: Not an admin" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res
                .status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
                .json({ success: false, error: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, isAdmin: true }, process.env.JWT_SECRET || "defaultSecret", { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000,
        });
        res.status(httpStatusCode_1.HttpStatusCode.OK).json({
            success: true,
            message: "Admin logged in successfully",
            token,
            user,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ error: "Error logging in user" });
    }
});
const fetchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_2.default.find();
        res.status(httpStatusCode_1.HttpStatusCode.OK).json({
            message: "✅ Users fetched successfully",
            users,
        });
    }
    catch (error) {
        res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: "❌ Error processing data",
            error,
        });
    }
});
const fetchUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log(userId, "useriiddidididiid");
        const tasks = yield taskModel_1.default.find({ userId });
        console.log(tasks, "tasks 123dfdf  1234");
        res.status(httpStatusCode_1.HttpStatusCode.OK).json({
            message: "✅ Tasks fetched successfully",
            tasks,
        });
    }
    catch (error) {
        res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: "❌ Error processing data",
            error,
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader("Set-Cookie", [
            "adminToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC",
        ]);
        res
            .status(httpStatusCode_1.HttpStatusCode.OK)
            .json({ success: true, message: "logged out" });
    }
    catch (error) {
        console.error("Error processing trips:", error);
        res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "❌ Error processing data",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
});
const adminController = {
    login,
    fetchUserDetails,
    fetchUsers,
    logout
};
exports.default = adminController;
