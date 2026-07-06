import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { UserModel } from "../../models/user.model";
import { VehicleModel } from "../../models/vehicle.model";
import { BookingModel } from "../../models/booking.model";
import { ReviewModel } from "../../models/review.model";
import { CategoryModel } from "../../models/category.model";
import { BrandModel } from "../../models/brand.model";

export class DashboardController {
  // admin - get all dashboard stats in one request
  async getStats(req: Request, res: Response) {
    try {
      // run all count queries in parallel for better performance
      const [
        totalVehicles,
        availableVehicles,
        totalCustomers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalReviews,
        totalCategories,
        totalBrands,
        recentBookings,
        recentCustomers,
        revenueResult,
      ] = await Promise.all([
        // vehicle stats
        VehicleModel.countDocuments(),
        VehicleModel.countDocuments({ isAvailable: true }),
        // customer stats - only count users with role "user"
        UserModel.countDocuments({ role: "user" }),
        // booking stats by status
        BookingModel.countDocuments(),
        BookingModel.countDocuments({ status: "pending" }),
        BookingModel.countDocuments({ status: "confirmed" }),
        BookingModel.countDocuments({ status: "completed" }),
        BookingModel.countDocuments({ status: "cancelled" }),
        // review and category stats
        ReviewModel.countDocuments(),
        CategoryModel.countDocuments(),
        BrandModel.countDocuments(),
        // recent 5 bookings with customer and vehicle details
        BookingModel.find()
          .populate("customerId", "-password")
          .populate("vehicleId")
          .sort({ createdAt: -1 })
          .limit(5),
        // recent 5 customers
        UserModel.find({ role: "user" }).sort({ createdAt: -1 }).limit(5),
        // total revenue from completed bookings only
        BookingModel.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
      ]);

      // extract total revenue from aggregate result
      const totalRevenue = revenueResult[0]?.total || 0;

      return ApiResponseHelper.success(
        res,
        {
          totalVehicles,
          availableVehicles,
          totalCustomers,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          totalRevenue,
          totalReviews,
          totalCategories,
          totalBrands,
          recentBookings,
          recentCustomers,
        },
        "Dashboard stats fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
