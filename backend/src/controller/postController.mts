import type { NextFunction, Request, Response } from "express";
import prisma from "../db/prismaClient.mjs";
import { Prisma } from "../../generated/prisma/client.js";

interface AuthRequest extends Request {
  user?: { id: number; email?: string };
}
export async function getAllPosts(
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const allPosts = await prisma.post.findMany({
      where: {
        isPublished: true,
      },
    });
    return res
      .status(200)
      .json({ success: true, msg: "sharing all post", posts: allPosts });
  } catch (err) {
    console.log(err);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}

export async function getPost(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res
        .status(400)
        .json({ success: false, message: "postId not provided" });
    }
    const id = parseInt(postId, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "postId must be a number" });
    }
    const post = await prisma.post.findUnique({
      where: { id, isPublished: true },
    });
    if (!post) {
      return res.status(404).json({ message: `Post with id ${id} not found` });
    }
    return res.status(200).json({
      msg: `sending post with postId ${id}`,
      post,
    });
  } catch (err) {
    console.error(err);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "postId not provided" });
    }
    const id = parseInt(postId, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "postId must be a number" });
    }
    await prisma.post.delete({ where: { id } });
    return res.status(200).json({ msg: `deleted post with postId ${id}` });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({ message: `Post not found` });
    }

    console.error(err);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}

export async function createPost(
  req: AuthRequest,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { title, content } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(400).json({ success: false, message: "access denied" });
    }
    const authorId = req.user.id;
    await prisma.post.create({
      data: {
        title,
        content,
        isPublished: true,
        likes: 1,
        authorId,
      },
    });
  } catch (err) {
    console.error(err);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (!req.params.postId)
    return res
      .status(400)
      .json({ success: false, message: "postId not found" });
  const { postId } = req.params;
  const { title } = req.body;
  const { content } = req.body;
  await prisma.post.update({
    where: {
      id: parseInt(postId),
    },
    data: {
      title,
      content,
    },
  });
}
