import mongoose, { Schema, Document } from "mongoose";
import { BrandType } from "../types/brand.type";

export interface IBrand extends BrandType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BrandMongoSchema: Schema = new Schema<IBrand>(
  {
    // no enum since brands aren't fixed like categories
    name: { type: String, required: true, unique: true },
    // logo image path set after multer upload, not required since admin might add logo later
    logoUrl: { type: String, required: false },
  },
  {
    timestamps: true, // createdAt and updatedAt auto managed by mongoose
  },
);

export const BrandModel = mongoose.model<IBrand>(
  "Brand", // creates "brands" collection in mongodb
  BrandMongoSchema,
);
