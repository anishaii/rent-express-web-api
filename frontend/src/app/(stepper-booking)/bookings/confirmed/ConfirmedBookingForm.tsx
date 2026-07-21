"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, CalendarIcon, MapPinIcon, AlertTriangleIcon } from "lucide-react";
import { handleGetBookingById } from "@/lib/actions/public/booking-action";

interface Booking {
  _id: string;
  bookingId?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  vehicleId: {
    name: string;
    imageUrl?: string;
    pricePerDay: number;
    categoryId: { name: string };
  };
}

export default function ConfirmedBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      router.push("/vehicles");
      return;
    }

    const fetchBooking = async () => {
      const result = await handleGetBookingById(bookingId);
      if (result.success) {
        setBooking(result.data);
      } else {
        router.push("/vehicles");
      }
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId, router]);

  if (loading) {
    return (
      <div className="px-6 sm:px-14 py-10 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const totalDays = Math.ceil(
    (new Date(booking.endDate).getTime() -
      new Date(booking.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <div className="px-6 sm:px-14 py-14 max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 className="h-11 w-11 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#13303a] mb-1.5">
          Booking Confirmed!
        </h1>
        <p className="text-sm text-[#51636a]">
          Your booking has been placed successfully. A confirmation has been
          saved to your account.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
          <div>
            <p className="text-xs text-[#8093a0] uppercase tracking-widest font-semibold">
              Booking ID
            </p>
            <p className="text-base font-bold text-[#0092B8]">
              {booking.bookingId || "—"}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 capitalize">
            {booking.status}
          </span>
        </div>

        <div className="flex items-start gap-4 mb-5">
          <div className="relative h-20 w-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            {booking.vehicleId.imageUrl ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${booking.vehicleId.imageUrl}`}
                alt={booking.vehicleId.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-bold text-2xl">
                {booking.vehicleId.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#13303a]">
              {booking.vehicleId.name}
            </h3>
            <p className="text-xs text-[#8093a0]">
              {booking.vehicleId.categoryId?.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center gap-2.5 bg-[#f8fafb] rounded-xl p-3">
            <CalendarIcon className="h-4 w-4 text-[#0092B8] shrink-0" />
            <div>
              <p className="text-[11px] text-[#8093a0]">Pick-up</p>
              <p className="text-xs font-semibold text-[#13303a]">
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[#f8fafb] rounded-xl p-3">
            <CalendarIcon className="h-4 w-4 text-[#0092B8] shrink-0" />
            <div>
              <p className="text-[11px] text-[#8093a0]">Drop-off</p>
              <p className="text-xs font-semibold text-[#13303a]">
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-cyan-50 rounded-xl p-3 mb-5">
          <MapPinIcon className="h-4 w-4 text-[#0092B8] shrink-0 mt-0.5" />
          <p className="text-xs text-[#51636a]">
            New Baneshwor, Kathmandu, Nepal
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-[#51636a]">
            {totalDays} days total
          </span>
          <span className="text-xl font-bold text-[#0092B8]">
            NPR {booking.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
        <AlertTriangleIcon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Important Note
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Please bring a valid driving license at the time of pickup.
            Bookings without proper identification may not be honored.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/bookings"
          className="flex-1 text-center bg-[#0092B8] hover:bg-[#007a99] text-white font-bold py-3.5 rounded-xl transition-colors"
        >
          Go to My Bookings
        </Link>
        <Link
          href="/"
          className="flex-1 text-center border border-gray-200 text-[#51636a] hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}