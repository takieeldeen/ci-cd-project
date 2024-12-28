import express from "express";
import morgan from "morgan";

import tourRouter from "./routes/tours";
import userRouter from "./routes/users";
import AppError from "./utils/AppError";
import errorController from "./controllers/errorController";
const app = express();
// Third Party Middlewares
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
// Mounting Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("*", (req, res, next) => {
  const error = new AppError(
    `Couldn't find any handler for route ${req.originalUrl}`,
    404
  );
  next(error);
});

app.use(errorController);
// Users Routes
export default app;
