"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { handleCancelBooking } from "@/lib/actions/public/booking-action";

interface BookingCardProps {
  booking: {
    _id: string;
    bookingId?: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    vehicleId: {
      name: string;
      imageUrl?: string;
      categoryId: { name: string };
    };
  };
  onCancelled?: () => void;
}

// status → color map, keeps things lively instead of monochrome
const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-cyan-100 text-[#0092B8]",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const { vehicleId: vehicle } = booking;

  const handleCancel = async () => {
    setCancelling(true);
    const result = await handleCancelBooking(booking._id);
    if (result.success) {
      toast.success("Booking cancelled", { duration: 1500 });
      onCancelled?.();
    } else {
      toast.error(result.message || "Failed to cancel booking", {
        duration: 1500,
      });
    }
    setCancelling(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5">
      {/* vehicle image */}
      <div className="relative h-24 w-full sm:w-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {vehicle.imageUrl ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${vehicle.imageUrl}`}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-bold text-2xl">
            {vehicle.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-bold text-[#13303a]">
              {vehicle.name}
            </h3>
            <p className="text-xs text-[#8093a0]">
              {vehicle.categoryId?.name} · {booking.bookingId || "—"}
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize shrink-0 ${
              statusStyles[booking.status]
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-[#0092B8]" />
            <div>
              <p className="text-[11px] text-[#8093a0] leading-none">
                Pick-up
              </p>
              <p className="text-xs font-medium text-[#13303a]">
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-[#0092B8]" />
            <div>
              <p className="text-[11px] text-[#8093a0] leading-none">
                Drop-off
              </p>
              <p className="text-xs font-medium text-[#13303a]">
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-[#8093a0] leading-none">
              Total Price
            </p>
            <p className="text-sm font-bold text-[#0092B8]">
              NPR {booking.totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* actions */}
      <div className="flex sm:flex-col gap-2 shrink-0">
        <Link
          href={`/bookings/confirmed?bookingId=${booking._id}`}
          className="text-xs font-semibold text-center border border-gray-200 text-[#51636a] hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          View Details
        </Link>

        {booking.status === "pending" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-xs font-semibold text-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Cancel Booking
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will cancel your booking for {vehicle.name}. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {cancelling ? "Cancelling..." : "Yes, Cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}