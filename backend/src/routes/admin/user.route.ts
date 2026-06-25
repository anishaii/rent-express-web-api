import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const adminUserRoute = Router();
const adminUserController = new AdminUserController();

// apply auth + admin middleware to all routes in this file
adminUserRoute.use(authorizedMiddleware, adminMiddleware);

// user management endpoints
adminUserRoute.get("/", adminUserController.getAllUserPaginated);
adminUserRoute.get("/:id", adminUserController.getUserById);
adminUserRoute.post("/", adminUserController.createUser);
adminUserRoute.put(
  "/:id",
  uploads.single("profileImage"),
  adminUserController.updateUser,
);
adminUserRoute.put("/:id/password", adminUserController.updatePassword);
adminUserRoute.delete("/:id", adminUserController.deleteUser);

export default adminUserRoute;
