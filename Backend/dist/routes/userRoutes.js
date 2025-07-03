"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/signup', userController_1.default.signupUser);
router.post('/login', userController_1.default.loginUser);
router.post('/createTask', authMiddleware_1.default, userController_1.default.createTask);
router.get('/fetchTasks/:userId', authMiddleware_1.default, userController_1.default.fetchTasks);
router.delete('/deleteTask', authMiddleware_1.default, userController_1.default.deleteTask);
router.patch('/updateStatus', authMiddleware_1.default, userController_1.default.updateStatus);
router.patch('/updateTask', authMiddleware_1.default, userController_1.default.updateTask);
router.post('/logout', userController_1.default.logout);
exports.default = router;
