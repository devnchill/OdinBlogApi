import { Router } from "express";
import {
  addLike,
  deleteLike,
  getLikes,
} from "../controller/likeController.mjs";

const likeRouter = Router();

likeRouter.get("/", getLikes);
likeRouter.post("/", addLike);
likeRouter.delete("/", deleteLike);

export default likeRouter;
