import type { NextFunction, Request, Response } from "express";
import prisma from "../db/prismaClient.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userName, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        userName,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const jwtToken = jwt.sign(
      { id: user.id, userName: user.userName, role: user.role },
      process.env.SECRET_KEY || "abrakadabra",
      { expiresIn: "7d" },
    );

    return res
      .status(200)
      .json({ success: true, message: "Login successful", token: jwtToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
