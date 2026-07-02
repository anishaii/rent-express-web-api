import mongoose, { Schema, Document } from "mongoose";
import { CategoryType } from "../types/category.type";

export interface ICategory extends CategoryType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryMongoSchema: Schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      enum: [
        "Bike",
        "Scooter",
        "Car",
        "Van",
        "Pickup Truck",
        "Luxury Car",
        "Electric Vehicle",
      ],
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const CategoryModel = mongoose.model<ICategory>(
  "Category",
  CategoryMongoSchema,
);
