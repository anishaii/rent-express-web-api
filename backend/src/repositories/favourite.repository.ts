import { FavouriteModel, IFavourite } from "../models/favourite.model";

export interface IFavouriteRepository {
  addFavourite(favourite: Partial<IFavourite>): Promise<IFavourite>;
  getFavouritesByUserId(userId: string): Promise<IFavourite[]>;
  getFavouriteByUserAndVehicle(
    userId: string,
    vehicleId: string,
  ): Promise<IFavourite | null>;
  removeFavourite(userId: string, vehicleId: string): Promise<boolean>;
}

export class FavouriteMongoRepository implements IFavouriteRepository {
  async addFavourite(favourite: Partial<IFavourite>): Promise<IFavourite> {
    const created = await FavouriteModel.create(favourite);
    return created;
  }

  // get all favourites for a specific user - used on user favourites page
  async getFavouritesByUserId(userId: string): Promise<IFavourite[]> {
    const found = await FavouriteModel.find({ userId })
      .populate({
        path: "vehicleId",
        populate: [{ path: "brandId" }, { path: "categoryId" }],
      })
      .sort({ createdAt: -1 });
    return found;
  }

  // check if user already favourited this vehicle
  async getFavouriteByUserAndVehicle(
    userId: string,
    vehicleId: string,
  ): Promise<IFavourite | null> {
    const found = await FavouriteModel.findOne({ userId, vehicleId });
    return found;
  }

  // remove favourite by userId and vehicleId
  async removeFavourite(userId: string, vehicleId: string): Promise<boolean> {
    const deleted = await FavouriteModel.findOneAndDelete({
      userId,
      vehicleId,
    });
    return !!deleted;
  }
}
