"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateStatusSchema = joi_1.default.object({
    taskId: joi_1.default.string().required(),
    status: joi_1.default.string().valid("pending", "in-progress", "completed"),
});
