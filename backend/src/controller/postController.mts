import type { NextFunction, Request, Response } from "express";
import prisma from "../db/prismaClient.mjs";

export async function getAllPosts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const allPosts = await prisma.post.findMany({
      where: {
        isPublished: true,
      },
    });
    return res.status(200).json(allPosts);
  } catch (err) {
    console.log(err);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return res.status(500).json({ error: "internal server error" });
  }
}

export async function getPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction,
) {}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction,
) {}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {}
