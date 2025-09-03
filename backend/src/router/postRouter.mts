import { Router } from "express";
import commentRouter from "./commentRouter.mjs";
import likeRouter from "./likeRouter.mjs";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controller/postController.mjs";

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.post("/", createPost);

postRouter.get("/:postId", getPost);
postRouter.put("/:postId", updatePost);
postRouter.delete("/:postId", deletePost);

postRouter.use("/:postId/comments", commentRouter);
postRouter.use("/:postId/likes", likeRouter);

export default postRouter;
