"use client";

import Link from "next/link";

interface Booking {
  _id: string;
  bookingId: string;
  customerId: {
    fullName: string;
    email: string;
  };
  vehicleId: {
    name: string;
  };
  totalPrice: number;
  status: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

// status badge colors matching booking table
const getStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-cyan-100 text-cyan-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">Recent Bookings</h2>
        <Link
          href="/dashboard/bookings"
          className="text-sm text-cyan-600 hover:text-cyan-700"
        >
          View All
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No bookings yet</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div>
                {/* vehicle name */}
                <p className="text-sm font-medium text-gray-800">
                  {booking.vehicleId?.name || "—"}
                </p>
                {/* customer name + booking id */}
                <p className="text-xs text-gray-400">
                  {booking.customerId?.fullName || "—"} •{" "}
                  <span className="text-cyan-600">{booking.bookingId}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* total price */}
                <p className="text-sm font-medium text-gray-700">
                  NPR {booking.totalPrice?.toLocaleString()}
                </p>
                {/* status badge */}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getStatusStyles(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}