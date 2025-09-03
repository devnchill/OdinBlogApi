import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getComment,
} from "../controller/commentController.mjs";

const commentRouter = Router();

commentRouter.get("/", getAllComments);
commentRouter.post("/", createComment);
commentRouter.get("/:commentId", getComment);
commentRouter.delete("/:commentId", deleteComment);

export default commentRouter;
