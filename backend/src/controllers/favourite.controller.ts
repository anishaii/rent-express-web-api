import { z } from "zod";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { AddFavouriteDTO } from "../dtos/favourite.dto";
import { FavouriteService } from "../services/favourite.service";

const favouriteService = new FavouriteService();

export class FavouriteController {
  // user - add a vehicle to favourites
  async addFavourite(req: Request, res: Response) {
    try {
      const favouriteData = AddFavouriteDTO.safeParse(req.body);
      if (!favouriteData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(favouriteData.error),
          400,
        );
      }

      // get userId from JWT token set by authorizedMiddleware
      const userId = (req as any).user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const favourite = await favouriteService.addFavourite(
        favouriteData.data,
        userId,
      );
      return ApiResponseHelper.success(
        res,
        favourite,
        "Vehicle added to favourites",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // user - get all their favourites
  async getMyFavourites(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const favourites = await favouriteService.getMyFavourites(userId);
      return ApiResponseHelper.success(
        res,
        favourites,
        "Favourites fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // user - check if a vehicle is in their favourites
  async checkFavourite(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params as { vehicleId: string };
      const userId = (req as any).user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const isFavourited = await favouriteService.checkFavourite(
        userId,
        vehicleId,
      );
      return ApiResponseHelper.success(
        res,
        { isFavourited },
        "Favourite status fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // user - remove a vehicle from favourites
  async removeFavourite(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params as { vehicleId: string };
      const userId = (req as any).user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      await favouriteService.removeFavourite(userId, vehicleId);
      return ApiResponseHelper.success(
        res,
        null,
        "Vehicle removed from favourites",
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
