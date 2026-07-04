import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import { BookingType } from "../types/booking.type";

export interface IBooking
  extends Omit<BookingType, "customerId" | "vehicleId">, Document {
  _id: mongoose.Types.ObjectId;
  // omit customerId and vehicleId to redefine as ObjectId reference
  customerId: ObjectId | string;
  vehicleId: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingMongoSchema: Schema = new Schema<IBooking>(
  {
    // custom readable booking id e.g. BK3c889e
    bookingId: { type: String, unique: true },
    // reference to the user who made the booking
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // reference to the vehicle being booked
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    // calculated automatically in service layer
    totalPrice: { type: Number, required: true },
    // default status is pending when booking is first created
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // createdAt and updatedAt auto managed by mongoose
  },
);

export const BookingModel: Model<IBooking> = mongoose.model<IBooking>(
  "Booking", // creates "bookings" collection in mongodb
  BookingMongoSchema,
);
