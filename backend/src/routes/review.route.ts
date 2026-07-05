import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const reviewRouter = Router();
const reviewController = new ReviewController();

// public - anyone can view reviews for a vehicle
reviewRouter.get("/vehicle/:vehicleId", reviewController.getReviewsByVehicleId);

// user - create a review (must be logged in)
reviewRouter.post(
  "/create",
  authorizedMiddleware,
  reviewController.createReview,
);

// user - update their own review
reviewRouter.put(
  "/update/:id",
  authorizedMiddleware,
  reviewController.updateReview,
);

// user - delete their own review
reviewRouter.delete(
  "/delete/:id",
  authorizedMiddleware,
  reviewController.deleteReview,
);

export default reviewRouter;
