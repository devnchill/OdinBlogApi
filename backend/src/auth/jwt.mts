import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function verifyJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Malformed token" });

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY || "abrakadabra");
    if (typeof payload === "string") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }
    req.user = payload as { id: number; userName: string; role: string };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
