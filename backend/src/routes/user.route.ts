import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { Router } from "express";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/whoami", authorizedMiddleware, userController.whoami);

export default userRouter;
