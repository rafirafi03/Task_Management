import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../constants/httpStatusCode";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Check Authorization header first, then cookies as fallback
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : req.cookies.token;

  if (!token) {
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultSecret"
    );
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
