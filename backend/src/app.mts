import express from "express";
import postRouter from "./router/postRouter.mjs";
import signupRouter from "./router/signupRouter.mjs";
import loginRouter from "./router/loginRouter.mjs";

const app = express();

const PORT = process.env.PORT || 8080;

app.use("v1/posts", postRouter);
app.use("v1/signup", signupRouter);
app.use("v1/login", loginRouter);

app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));
