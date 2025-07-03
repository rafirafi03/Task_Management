import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { HttpStatusCode } from "../constants/httpStatusCode";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import TaskModel from "../models/taskModel";
import UserModel from "../models/userModel";
import { signupSchema } from "../validations/authValidation";

dotenv.config();

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        error: error.details[0].message,
      });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ success: false, error: "User not found" });
      return;
    }

    if (!user.isAdmin) {
      res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ success: false, error: "Access denied: Not an admin" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ success: false, error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: true },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } as jwt.SignOptions
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
    });

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Error logging in user" });
  }
};

const fetchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find();

    res.status(HttpStatusCode.OK).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Error processing data",
      error,
    });
  }
};

const fetchUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    console.log(userId, "useriiddidididiid");

    const tasks = await TaskModel.find({ userId });

    console.log(tasks, "tasks 123dfdf  1234");

    res.status(HttpStatusCode.OK).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Error processing data",
      error,
    });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.setHeader("Set-Cookie", [
      "adminToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC",
    ]);
    res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: "logged out" });
  } catch (error) {
    console.error("Error processing trips:", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error processing data",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

const adminController = {
  login,
  fetchUserDetails,
  fetchUsers,
  logout,
};

export default adminController;
