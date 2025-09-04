import type { NextFunction, Request, Response } from "express";
import prisma from "../db/prismaClient.mjs";

export async function getAllComments(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { postId } = req.params;
    if (!postId)
      return res
        .status(400)
        .json({ success: false, message: "postId not provided" });

    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId, 10) },
      include: { user: { select: { id: true, userName: true } } },
    });

    return res.status(200).json({ success: true, comments });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function getComment(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { commentId } = req.params;
    if (!commentId)
      return res
        .status(400)
        .json({ success: false, message: "commentId not provided" });

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId, 10) },
      include: { user: { select: { id: true, userName: true } } },
    });

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    return res.status(200).json({ success: true, comment });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function createComment(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;
    if (!postId || !userId || !content)
      return res.status(400).json({
        success: false,
        message: "postId, userId and content required",
      });

    const comment = await prisma.comment.create({
      data: {
        postId: parseInt(postId, 10),
        userId: parseInt(userId, 10),
        content,
      },
    });

    return res
      .status(201)
      .json({ success: true, message: "Comment created", comment });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const { commentId } = req.params;
    if (!commentId) {
      return res
        .status(400)
        .json({ success: false, message: "commentId not provided" });
    }

    const id = parseInt(commentId, 10);
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.userId !== req.user.id && req.user.role !== "AUTHOR") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await prisma.comment.delete({ where: { id } });

    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (err: unknown) {
    if ((err as any)?.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
