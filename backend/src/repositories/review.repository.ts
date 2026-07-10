import { ReviewModel, IReview } from "../models/review.model";

export interface IReviewRepository {
  createReview(review: Partial<IReview>): Promise<IReview>;
  getReviewById(id: string): Promise<IReview | null>;
  getReviewsByVehicleId(vehicleId: string): Promise<IReview[]>;
  getReviewByCustomerAndVehicle(
    customerId: string,
    vehicleId: string,
  ): Promise<IReview | null>;
  update(id: string, review: Partial<IReview>): Promise<IReview | null>;
  delete(id: string): Promise<boolean>;
  getAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: IReview[]; total: number }>;
  getFeaturedReviews(limit: number): Promise<IReview[]>;
}

export class ReviewMongoRepository implements IReviewRepository {
  async createReview(review: Partial<IReview>): Promise<IReview> {
    const created = await ReviewModel.create(review);
    return created;
  }

  async getReviewById(id: string): Promise<IReview | null> {
    // populate customer so we get full user object not just id
    const found = await ReviewModel.findById(id)
      .populate("customerId", "-password")
      .populate("vehicleId");
    return found;
  }

  // get all reviews for a specific vehicle - used on vehicle detail page
  async getReviewsByVehicleId(vehicleId: string): Promise<IReview[]> {
    const found = await ReviewModel.find({ vehicleId })
      .populate("customerId", "-password")
      .sort({ createdAt: -1 });
    return found;
  }

  // check if customer already reviewed this vehicle - prevents duplicate reviews
  async getReviewByCustomerAndVehicle(
    customerId: string,
    vehicleId: string,
  ): Promise<IReview | null> {
    const found = await ReviewModel.findOne({ customerId, vehicleId });
    return found;
  }

  async update(id: string, review: Partial<IReview>): Promise<IReview | null> {
    const updated = await ReviewModel.findByIdAndUpdate(id, review, {
      new: true,
    });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ReviewModel.findByIdAndDelete(id);
    return !!deleted;
  }

  // get all reviews with pagination for admin dashboard
  async getAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: IReview[]; total: number }> {
    const total = await ReviewModel.countDocuments();
    const data = await ReviewModel.find()
      .populate("customerId", "-password")
      .populate("vehicleId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { data, total };
  }

  // get top-rated recent reviews across all vehicles - used on homepage
  async getFeaturedReviews(limit: number): Promise<IReview[]> {
    const found = await ReviewModel.find({ rating: { $gte: 4 } })
      .populate("customerId", "-password")
      .populate("vehicleId")
      .sort({ createdAt: -1 })
      .limit(limit);
    return found;
  }
}
