import { Router } from "express";
import { FavouriteController } from "../controllers/favourite.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const favouriteRouter = Router();
const favouriteController = new FavouriteController();

// user - add a vehicle to favourites (must be logged in)
favouriteRouter.post(
  "/add",
  authorizedMiddleware,
  favouriteController.addFavourite,
);

// user - get all their favourites
favouriteRouter.get(
  "/my-favourites",
  authorizedMiddleware,
  favouriteController.getMyFavourites,
);

// user - check if a vehicle is in their favourites
favouriteRouter.get(
  "/check/:vehicleId",
  authorizedMiddleware,
  favouriteController.checkFavourite,
);

// user - remove a vehicle from favourites
favouriteRouter.delete(
  "/remove/:vehicleId",
  authorizedMiddleware,
  favouriteController.removeFavourite,
);

export default favouriteRouter;
