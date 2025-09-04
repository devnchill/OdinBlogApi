import type { NextFunction, Request, Response } from "express";

export default function authorOnly(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user?.role !== "AUTHOR")
    return res.status(403).json({ success: false, message: "Forbidden" });
  next();
}
