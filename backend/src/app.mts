import express from "express";
import postRouter from "./router/postRouter.mjs";

const app = express();

const PORT = process.env.PORT || 8080;

app.use("/posts", postRouter);

app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));
