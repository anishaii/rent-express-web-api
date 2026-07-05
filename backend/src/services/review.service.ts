import { ReviewMongoRepository } from "../repositories/review.repository";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { IReview } from "../models/review.model";
import { HttpException } from "../exceptions/http-exception";

const reviewRepository = new ReviewMongoRepository();

export class ReviewService {
  // create a new review - checks for duplicate review from same customer
  async createReview(
    data: CreateReviewDTO,
    customerId: string,
  ): Promise<IReview> {
    // check if customer already reviewed this vehicle
    const existing = await reviewRepository.getReviewByCustomerAndVehicle(
      customerId,
      data.vehicleId,
    );
    if (existing) {
      throw new HttpException(400, "You have already reviewed this vehicle");
    }

    const review = await reviewRepository.createReview({
      ...data,
      customerId,
    } as unknown as Partial<IReview>);
    return review;
  }

  // get all reviews for a specific vehicle - used on vehicle detail page
  async getReviewsByVehicleId(vehicleId: string): Promise<IReview[]> {
    return await reviewRepository.getReviewsByVehicleId(vehicleId);
  }

  // user updates their own review
  async updateReview(
    id: string,
    data: UpdateReviewDTO,
    customerId: string,
  ): Promise<IReview> {
    const existing = await reviewRepository.getReviewById(id);
    if (!existing) {
      throw new HttpException(404, "Review not found");
    }
    // check if the review belongs to the customer
    if (existing.customerId.toString() !== customerId) {
      throw new HttpException(403, "You can only update your own reviews");
    }
    const updated = await reviewRepository.update(id, data);
    return updated!;
  }

  // user deletes their own review
  async deleteReview(id: string, customerId: string): Promise<boolean> {
    const existing = await reviewRepository.getReviewById(id);
    if (!existing) {
      throw new HttpException(404, "Review not found");
    }
    // check if the review belongs to the customer
    if (existing.customerId.toString() !== customerId) {
      throw new HttpException(403, "You can only delete your own reviews");
    }
    return await reviewRepository.delete(id);
  }

  // admin gets all reviews with pagination
  async getAllReviewsPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: IReview[]; total: number }> {
    return await reviewRepository.getAllPaginated(page, limit);
  }

  // admin deletes any review
  async adminDeleteReview(id: string): Promise<boolean> {
    const existing = await reviewRepository.getReviewById(id);
    if (!existing) {
      throw new HttpException(404, "Review not found");
    }
    return await reviewRepository.delete(id);
  }
}
