"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
router.post('/login', adminController_1.default.login);
router.get('/fetchUsers', adminAuthMiddleware_1.default, adminController_1.default.fetchUsers);
router.get('/fetchUserDetails/:userId', adminAuthMiddleware_1.default, adminController_1.default.fetchUserDetails);
router.post('/logout', adminController_1.default.logout);
exports.default = router;
