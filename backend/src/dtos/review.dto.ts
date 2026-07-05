import { z } from "zod";
import { ReviewSchema } from "../types/review.type";

// Create Review DTO - user sends vehicleId, rating and comment
// customerId is taken from JWT token in service layer
export const CreateReviewDTO = ReviewSchema.pick({
  vehicleId: true,
  rating: true,
  comment: true,
});
export type CreateReviewDTO = z.infer<typeof CreateReviewDTO>;

// Update Review DTO - user can only update rating and comment
export const UpdateReviewDTO = ReviewSchema.pick({
  rating: true,
  comment: true,
}).partial();
export type UpdateReviewDTO = z.infer<typeof UpdateReviewDTO>;
