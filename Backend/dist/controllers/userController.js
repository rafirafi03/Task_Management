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
exports.deleteTask = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const httpStatusCode_1 = require("../constants/httpStatusCode");
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const authValidation_1 = require("../validations/authValidation");
const createTaskValidation_1 = require("../validations/createTaskValidation");
const fetchTaskValidation_1 = require("../validations/fetchTaskValidation");
const deleteTaskValidation_1 = require("../validations/deleteTaskValidation");
const updateStatusValidation_1 = require("../validations/updateStatusValidation");
const updateTaskValidation_1 = require("../validations/updateTaskValidation");
dotenv_1.default.config();
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = authValidation_1.signupSchema.validate(req.body);
        if (error) {
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                error: error.details[0].message,
            });
            return;
        }
        console.log(req.body, "req...bodddyydydydyyd");
        const { name, email, password } = req.body;
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(httpStatusCode_1.HttpStatusCode.CONFLICT).json({
                success: false,
                error: "User already exists. Please login.",
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new userModel_1.default({ name, email, password: hashedPassword });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "defaultSecret", { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000,
        });
        res.status(httpStatusCode_1.HttpStatusCode.CREATED).json({
            success: true,
            message: "User created successfully",
            token,
            user,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ error: "Error in signup" });
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res
                .status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
                .json({ success: false, error: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, isAdmin: true }, process.env.JWT_SECRET || "defaultSecret", { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000,
        });
        res.status(httpStatusCode_1.HttpStatusCode.OK).json({
            success: true,
            message: "User logged in successfully",
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
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = createTaskValidation_1.createTaskSchema.validate(req.body);
        if (error) {
            console.log(error, "error1234567");
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message,
            });
            return;
        }
        const { title, userId } = req.body;
        if (!userId) {
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: "User ID required",
            });
            return;
        }
        const newTask = new taskModel_1.default({
            title,
            userId,
        });
        const savedTask = yield newTask.save();
        res.status(httpStatusCode_1.HttpStatusCode.CREATED).json({
            success: true,
            message: "✅ Task created successfully",
            task: savedTask,
        });
    }
    catch (error) {
        console.error("Error in createTask:", error);
        res
            .status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: "❌ Error processing data", error });
    }
});
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = updateStatusValidation_1.updateStatusSchema.validate(req.body);
        if (error) {
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                error: error.details[0].message,
            });
            return;
        }
        const { taskId, status } = req.body;
        const updatedTask = yield taskModel_1.default.findByIdAndUpdate(taskId, { status }, { new: true });
        if (!updatedTask) {
            res
                .status(httpStatusCode_1.HttpStatusCode.NOT_FOUND)
                .json({ message: "❌ Task not found" });
            return;
        }
        res.status(httpStatusCode_1.HttpStatusCode.OK).json({
            success: true,
            message: "✅ Task status updated successfully",
            task: updatedTask,
        });
    }
    catch (error) {
        res
            .status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: "❌ Error processing data", error });
    }
});
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = updateTaskValidation_1.updateTaskSchema.validate(req.body);
        if (error) {
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                error: error.details[0].message,
            });
            return;
        }
        const { taskId, title } = req.body;
        const updatedTask = yield taskModel_1.default.findByIdAndUpdate(taskId, { title }, { new: true });
        if (!updatedTask) {
            res
                .status(httpStatusCode_1.HttpStatusCode.NOT_FOUND)
                .json({ message: "❌ Task not found" });
            return;
        }
        res.status(httpStatusCode_1.HttpStatusCode.OK).json({
            success: true,
            message: "✅ Task updated successfully",
            task: updatedTask,
        });
    }
    catch (error) {
        res
            .status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: "❌ Error processing data", error });
    }
});
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = deleteTaskValidation_1.deleteTaskSchema.validate(req.body);
        if (error) {
            console.log(error, "error1234567");
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message,
            });
            return;
        }
        const { taskId } = req.body;
        if (!taskId) {
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: "❌ Task ID is required",
            });
            return;
        }
        const deletedTask = yield taskModel_1.default.findByIdAndDelete(taskId);
        if (!deletedTask) {
            res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "❌ Task not found",
            });
            return;
        }
        res.status(httpStatusCode_1.HttpStatusCode.OK).json({
            success: true,
            message: "✅ Task deleted successfully",
            task: deletedTask,
        });
    }
    catch (error) {
        console.error("Error in deleteTask:", error);
        res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "❌ Error processing data",
            error,
        });
    }
});
exports.deleteTask = deleteTask;
const fetchTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = fetchTaskValidation_1.fetchTasksSchema.validate(req.params);
        if (error) {
            console.log(error, "error1234567");
            res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message,
            });
            return;
        }
        const { userId } = req.params;
        const { status } = req.query; // Get status from query parameters
        // Build the filter object
        const filter = { userId };
        // Add status filter if provided and not 'all'
        if (status && status !== "all") {
            filter.status = status;
        }
        const tasks = yield taskModel_1.default.find(filter).sort({ createdAt: -1 });
        res.status(httpStatusCode_1.HttpStatusCode.OK).json({
            success: true,
            tasks,
        });
    }
    catch (error) {
        console.error("Error in fetchTasks:", error);
        res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "❌ Error processing data",
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader("Set-Cookie", [
            "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC",
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
const userController = {
    signupUser,
    loginUser,
    createTask,
    updateTask,
    updateStatus,
    fetchTasks,
    deleteTask: exports.deleteTask,
    logout,
};
exports.default = userController;
