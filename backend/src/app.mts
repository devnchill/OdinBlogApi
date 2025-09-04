import express from "express";
import postRouter from "./router/postRouter.mjs";
import signupRouter from "./router/signupRouter.mjs";
import loginRouter from "./router/loginRouter.mjs";
import verifyJwt from "./auth/jwt.mjs";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/signup", signupRouter);
app.use("/v1/login", loginRouter);

app.use(verifyJwt);
app.use("/v1/posts", postRouter);

app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));
