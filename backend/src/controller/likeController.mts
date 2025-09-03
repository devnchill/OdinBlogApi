import type { NextFunction, Request, Response } from "express";
import prisma from "../db/prismaClient.mjs";

export async function getLikes(
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

    const likes = await prisma.like.findMany({
      where: { postId: parseInt(postId, 10) },
      include: { user: { select: { id: true, userName: true } } },
    });

    return res.status(200).json({ success: true, likes });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function addLike(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!postId || !userId)
      return res
        .status(400)
        .json({ success: false, message: "postId and userId required" });

    const like = await prisma.like.create({
      data: {
        postId: parseInt(postId, 10),
        userId: parseInt(userId, 10),
      },
    });

    await prisma.post.update({
      where: { id: parseInt(postId, 10) },
      data: { likes: { increment: 1 } },
    });

    return res.status(201).json({ success: true, message: "Like added", like });
  } catch (err: unknown) {
    if ((err as any)?.code === "P2002") {
      return res
        .status(400)
        .json({ success: false, message: "User already liked this post" });
    }
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function deleteLike(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!postId || !userId)
      return res
        .status(400)
        .json({ success: false, message: "postId and userId required" });

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: parseInt(userId, 10),
          postId: parseInt(postId, 10),
        },
      },
    });

    await prisma.post.update({
      where: { id: parseInt(postId, 10) },
      data: { likes: { decrement: 1 } },
    });
    return res.status(200).json({ success: true, message: "Like removed" });
  } catch (err: unknown) {
    if ((err as any)?.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Like not found" });
    }
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
