import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { HttpStatusCode } from "../constants/httpStatusCode";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import TaskModel from "../models/taskModel";
import { signupSchema } from "../validations/authValidation";
import { createTaskSchema } from "../validations/createTaskValidation";
import { fetchTasksSchema } from "../validations/fetchTaskValidation";
import { deleteTaskSchema } from "../validations/deleteTaskValidation";
import { updateStatusSchema } from "../validations/updateStatusValidation";
import { updateTaskSchema } from "../validations/updateTaskValidation";

dotenv.config();

const signupUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        error: error.details[0].message,
      });
      return;
    }

    console.log(req.body, "req...bodddyydydydyyd");

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        error: "User already exists. Please login.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } as jwt.SignOptions
    );

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: "User created successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in signup" });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
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

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "User logged in successfully",
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

const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = createTaskSchema.validate(req.body);

    if (error) {
      console.log(error, "error1234567");
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { title, userId } = req.body;

    if (!userId) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "User ID required",
      });
      return;
    }

    const newTask = new TaskModel({
      title,
      userId,
    });

    const savedTask = await newTask.save();

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error in createTask:", error);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Error processing data", error });
  }
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        error: error.details[0].message,
      });
      return;
    }
    const { taskId, status } = req.body;

    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      res.status(HttpStatusCode.NOT_FOUND).json({ message: "Task not found" });
      return;
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error processing data", error });
  }
};

const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        error: error.details[0].message,
      });
      return;
    }
    const { taskId, title } = req.body;

    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { title },
      { new: true }
    );

    if (!updatedTask) {
      res.status(HttpStatusCode.NOT_FOUND).json({ message: "Task not found" });
      return;
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error processing data", error });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = deleteTaskSchema.validate(req.body);

    if (error) {
      console.log(error, "error1234567");
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }
    const { taskId } = req.body;

    if (!taskId) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Task ID is required",
      });
      return;
    }

    const deletedTask = await TaskModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Error in deleteTask:", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error processing data",
      error,
    });
  }
};

const fetchTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = fetchTasksSchema.validate(req.params);

    if (error) {
      console.log(error, "error1234567");
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { userId } = req.params;
    const { status } = req.query;

    const filter: any = { userId };

    if (status && status !== "all") {
      filter.status = status;
    }

    const tasks = await TaskModel.find(filter).sort({ createdAt: -1 });

    res.status(HttpStatusCode.OK).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error processing data",
    });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.setHeader("Set-Cookie", [
      "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC",
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

const userController = {
  signupUser,
  loginUser,
  createTask,
  updateTask,
  updateStatus,
  fetchTasks,
  deleteTask,
  logout,
};

export default userController;
