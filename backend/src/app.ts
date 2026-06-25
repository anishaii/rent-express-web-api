import express, { Application, NextFunction, Request, Response } from "express";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import cors from "cors";
import path from "path";

// import routes
import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import categoryRoutes from "./routes/category.route";
import adminCategoryRoutes from "./routes/admin/category.route";
import brandRoutes from "./routes/brand.route";
import adminBrandRoutes from "./routes/admin/brand.route";

const app: Application = express();

const corsOptions = {
  origin: ["*"], // allow all origins for now
  successStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// auth routes
app.use("/api/auth", userRoutes);

// admin Route
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/category", adminCategoryRoutes);
app.use("/api/admin/brand", adminBrandRoutes);

// public routes
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);

// global 404 handler (at bottom)
app.use((req: Request, res: Response) => {
  return res.status(404).json({ message: "API not found" });
});

// global error handler(at bottom)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  if (err instanceof HttpException) {
    return ApiResponseHelper.error(res, err.message, err.status);
  }
  return ApiResponseHelper.error(res, "Internal Server Error", 500);
});

export default app;
