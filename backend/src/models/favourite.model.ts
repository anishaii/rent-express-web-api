import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import { FavouriteType } from "../types/favourite.type";

export interface IFavourite
  extends Omit<FavouriteType, "userId" | "vehicleId">, Document {
  _id: mongoose.Types.ObjectId;
  // omit userId and vehicleId to redefine as ObjectId reference
  userId: ObjectId | string;
  vehicleId: ObjectId | string;
  createdAt: Date;
}

const FavouriteMongoSchema: Schema = new Schema<IFavourite>(
  {
    // reference to the user who added the favourite
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // reference to the vehicle being favourited
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt needed for favourites
  },
);

export const FavouriteModel: Model<IFavourite> = mongoose.model<IFavourite>(
  "Favourite", // creates "favourites" collection in mongodb
  FavouriteMongoSchema,
);
