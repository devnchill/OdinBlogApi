import { Router } from "express";
import { createUser } from "../controller/signupController.mjs";

const signupRouter = Router();

signupRouter.post("/", createUser);

export default signupRouter;
