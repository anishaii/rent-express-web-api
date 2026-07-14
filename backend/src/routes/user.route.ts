import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { Router } from "express";
import { uploads } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();

// register
userRouter.post("/register", userController.registerUser);
// login
userRouter.post("/login", userController.loginUser);
// update user / profile picture
userRouter.put(
  "/update",
  authorizedMiddleware,
  uploads.single("profileImage"),
  userController.updateUser,
);
// who am i?
userRouter.get("/whoami", authorizedMiddleware, userController.whoami);
// request a password reset email
userRouter.post(
  "/request-password-reset",
  userController.sendResetPasswordEmail,
);

// reset password using token from email link
userRouter.post("/reset-password/:token", userController.resetPassword);

export default userRouter;
