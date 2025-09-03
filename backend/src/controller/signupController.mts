import type { NextFunction, Request, Response } from "express";
import prisma from "../db/prismaClient.mjs";
import bcrypt from "bcryptjs";

export async function createUser(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { userName, password } = req.body;
    if (!userName)
      res.status(400).json({
        success: false,
        message: "invalid userName",
      });
    if (!password)
      res.status(400).json({
        success: false,
        message: "invalid password",
      });
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        userName,
        hashedPassword,
      },
    });
    res
      .status(201)
      .json({ success: true, message: "created account succesfully" });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ success: false, message: "username already exists" });
    }
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
}
