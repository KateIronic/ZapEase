import express from "express";
import { userRouter } from "./router/userRouter.js";
import { zapRouter } from "./router/zapRouter.js";
import cors from "cors";
import { triggerRouter } from "./router/trigger.js";
import { actionRouter } from "./router/action.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);
app.listen(5000);

console.log("Server started at http://localhost:5000");
