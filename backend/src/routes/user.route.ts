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

export default userRouter;
