import { FavouriteMongoRepository } from "../repositories/favourite.repository";
import { AddFavouriteDTO } from "../dtos/favourite.dto";
import { IFavourite } from "../models/favourite.model";
import { HttpException } from "../exceptions/http-exception";

const favouriteRepository = new FavouriteMongoRepository();

export class FavouriteService {
  // add a vehicle to favourites - checks for duplicate
  async addFavourite(
    data: AddFavouriteDTO,
    userId: string,
  ): Promise<IFavourite> {
    // check if user already favourited this vehicle
    const existing = await favouriteRepository.getFavouriteByUserAndVehicle(
      userId,
      data.vehicleId,
    );
    if (existing) {
      throw new HttpException(400, "Vehicle already in favourites");
    }

    const favourite = await favouriteRepository.addFavourite({
      userId,
      vehicleId: data.vehicleId,
    } as unknown as Partial<IFavourite>);
    return favourite;
  }

  // get all favourites for the logged in user
  async getMyFavourites(userId: string): Promise<IFavourite[]> {
    return await favouriteRepository.getFavouritesByUserId(userId);
  }

  // check if a vehicle is in user's favourites
  async checkFavourite(userId: string, vehicleId: string): Promise<boolean> {
    const existing = await favouriteRepository.getFavouriteByUserAndVehicle(
      userId,
      vehicleId,
    );
    return !!existing;
  }

  // remove a vehicle from favourites
  async removeFavourite(userId: string, vehicleId: string): Promise<boolean> {
    const existing = await favouriteRepository.getFavouriteByUserAndVehicle(
      userId,
      vehicleId,
    );
    if (!existing) {
      throw new HttpException(404, "Favourite not found");
    }
    return await favouriteRepository.removeFavourite(userId, vehicleId);
  }
}
