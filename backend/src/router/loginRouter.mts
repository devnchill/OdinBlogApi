import { Router } from "express";
import { loginUser } from "../controller/loginController.mjs";

const loginRouter = Router();

loginRouter.post("/", loginUser);

export default loginRouter;
