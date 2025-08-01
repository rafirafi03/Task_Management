"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateTaskSchema = joi_1.default.object({
    taskId: joi_1.default.string().required(),
    title: joi_1.default.string().min(3).max(100),
});
