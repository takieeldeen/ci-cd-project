import express from "express";
import { userController } from "../controllers/users";
import { authController } from "../controllers/auth";
const userRouter = express.Router();

userRouter.post("/signup", authController?.signup);
userRouter.post("/signin", authController?.signin);

userRouter
  .route("/")
  .get(userController.useGetUsers)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.useGetUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;
