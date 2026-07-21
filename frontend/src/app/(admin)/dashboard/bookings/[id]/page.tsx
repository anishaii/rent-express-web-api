import { handleGetBookingById } from "@/lib/actions/admin/booking-action";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await handleGetBookingById(id);

  if (!result.success) {
    throw new Error(result.message);
  }

  if (!result.data) {
    notFound();
  }

  const booking = result.data;

  return (
    <div className="p-6">
      {/* Back link */}
      <Link
        href="/dashboard/bookings"
        className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Bookings
      </Link>

      {/* Single card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* Booking Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Booking Details</h1>
            <p className="text-sm text-cyan-600 mt-1">
              Booking ID: <span className="font-medium">{booking.bookingId}</span>
            </p>
          </div>
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full capitalize ${
            booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
            booking.status === "confirmed" ? "bg-cyan-100 text-cyan-700" :
            booking.status === "completed" ? "bg-green-100 text-green-700" :
            "bg-red-100 text-red-600"
          }`}>
            {booking.status}
          </span>
        </div>

        {/* Customer Information */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Customer Information
          </h2>
          {/* customer avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-cyan-100 shrink-0">
              {booking.customerId?.imageUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${booking.customerId.imageUrl}`}
                  alt={booking.customerId.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-cyan-600 font-semibold text-sm">
                  {booking.customerId?.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {booking.customerId?.fullName}
              </p>
              <p className="text-xs text-gray-400">{booking.customerId?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-cyan-600 font-medium mb-1">Name</p>
              <p className="text-gray-800">{booking.customerId?.fullName || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-cyan-600 font-medium mb-1">Email</p>
              <p className="text-gray-800">{booking.customerId?.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-cyan-600 font-medium mb-1">Phone</p>
              <p className="text-gray-800">{booking.customerId?.contactNumber || "—"}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Vehicle Details
          </h2>
          <div className="flex items-start gap-4">
            {/* vehicle image */}
            <div className="relative h-28 w-40 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {booking.vehicleId?.imageUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${booking.vehicleId.imageUrl}`}
                  alt={booking.vehicleId.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-semibold text-xl">
                  {booking.vehicleId?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <div>
                <p className="text-sm text-cyan-600 font-medium mb-1">Vehicle</p>
                <p className="text-gray-800">{booking.vehicleId?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-600 font-medium mb-1">Category</p>
                <p className="text-gray-800">{booking.vehicleId?.categoryId?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-600 font-medium mb-1">Brand</p>
                <p className="text-gray-800">{booking.vehicleId?.brandId?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-600 font-medium mb-1">Price Per Day</p>
                <p className="text-gray-800">NPR {booking.vehicleId?.pricePerDay?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rental Period */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Rental Period
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-cyan-600 font-medium mb-1">Pick-up Date</p>
              <p className="text-gray-800">
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-600 font-medium mb-1">Drop-off Date</p>
              <p className="text-gray-800">
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-600 font-medium mb-1">Duration</p>
              <p className="text-gray-800">
                {Math.ceil(
                  (new Date(booking.endDate).getTime() -
                    new Date(booking.startDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                days
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-600 font-medium mb-1">Booked On</p>
              <p className="text-gray-800">
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Payment Summary
          </h2>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-sm text-gray-800">
              NPR {booking.totalPrice?.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between py-3">
            <p className="text-sm font-semibold text-gray-800">Total</p>
            <p className="text-sm font-semibold text-cyan-600">
              NPR {booking.totalPrice?.toLocaleString()}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}