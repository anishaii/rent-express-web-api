import mongoose, { Schema, Document } from "mongoose";
import { VehicleType } from "../types/vehicle.type";

export interface IVehicle
  extends Omit<VehicleType, "brandId" | "categoryId">, Document {
  _id: mongoose.Types.ObjectId;
  // override string type from zod schema to use proper ObjectId reference
  brandId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleMongoSchema: Schema = new Schema<IVehicle>(
  {
    // reference to brand collection
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    // reference to category collection
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    // set by multer after image upload
    imageUrl: { type: String },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      required: true,
    },
    seats: { type: Number, required: true },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    // defaults to true when vehicle is first added
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true, // createdAt and updatedAt auto managed by mongoose
  },
);

export const VehicleModel = mongoose.model<IVehicle>(
  "Vehicle", // creates "vehicles" collection in mongodb
  VehicleMongoSchema,
);
