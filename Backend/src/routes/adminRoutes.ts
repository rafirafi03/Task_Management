import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController";
import authMiddleware from "../middlewares/adminAuthMiddleware";

router.post("/login", adminController.login);
router.get("/fetchUsers", authMiddleware, adminController.fetchUsers);
router.get(
  "/fetchUserDetails/:userId",
  authMiddleware,
  adminController.fetchUserDetails
);
router.post("/logout", adminController.logout);

export default router;
