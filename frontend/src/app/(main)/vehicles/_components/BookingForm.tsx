"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarIcon, LogInIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface BookingFormProps {
  vehicleId: string;
  pricePerDay: number;
  isAvailable: boolean;
}

export default function BookingForm({
  vehicleId,
  pricePerDay,
  isAvailable,
}: BookingFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // calculate total days and price
  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalPrice = totalDays * pricePerDay;

  const handleBookNow = async () => {
    // show login dialog if user is not authenticated
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select pickup and drop-off dates", { duration: 1500 });
      return;
    }

    if (endDate <= startDate) {
      toast.error("Drop-off date must be after pickup date", { duration: 1500 });
      return;
    }

    setIsLoading(true);
    try {
      const { handleCreateBooking } = await import(
        "@/lib/actions/public/booking-action"
      );
      const result = await handleCreateBooking({
        vehicleId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (result.success) {
        toast.success("Booking created successfully!", { duration: 1500 });
        router.push("/bookings");
      } else {
        toast.error(result.message || "Booking failed", { duration: 1500 });
      }
    } catch (error) {
      toast.error("Something went wrong", { duration: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* login required dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="h-14 w-14 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <LogInIcon className="h-6 w-6 text-[#0092B8]" />
            </div>
            <DialogTitle className="text-center text-[#13303a]">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-center text-[#51636a]">
              You need to be logged in to make a booking. Please login or
              create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full bg-[#0092B8] hover:bg-[#007a99] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              <LogInIcon className="h-4 w-4" />
              Login to your account
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 w-full border border-[#0092B8] text-[#0092B8] hover:bg-cyan-50 text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              <UserPlusIcon className="h-4 w-4" />
              Create new account
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* booking form */}
      <div className="space-y-4">
        {/* pickup date */}
        <div>
          <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-1.5 block">
            Pick-up Date
          </label>
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 text-sm text-left hover:border-cyan-400 transition-colors">
                <CalendarIcon className="h-4 w-4 text-[#0092B8] shrink-0" />
                <span className={startDate ? "text-[#13303a]" : "text-[#8093a0]"}>
                  {startDate ? startDate.toLocaleDateString() : "Select pickup date"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartOpen(false);
                }}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* dropoff date */}
        <div>
          <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-1.5 block">
            Drop-off Date
          </label>
          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 text-sm text-left hover:border-cyan-400 transition-colors">
                <CalendarIcon className="h-4 w-4 text-[#0092B8] shrink-0" />
                <span className={endDate ? "text-[#13303a]" : "text-[#8093a0]"}>
                  {endDate ? endDate.toLocaleDateString() : "Select drop-off date"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setEndOpen(false);
                }}
                disabled={(date) =>
                  date < new Date() || (startDate ? date <= startDate : false)
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* price summary */}
        {totalDays > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#51636a]">
                NPR {pricePerDay.toLocaleString()} × {totalDays} days
              </span>
              <span className="text-[#13303a] font-medium">
                NPR {totalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold border-t border-gray-200 pt-2">
              <span className="text-[#13303a]">Total</span>
              <span className="text-[#0092B8]">
                NPR {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* book now button */}
        <button
          onClick={handleBookNow}
          disabled={!isAvailable || isLoading}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
            !isAvailable
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#0092B8] hover:bg-[#007a99] text-white"
          }`}
        >
          {!isAvailable
            ? "Not Available"
            : isLoading
            ? "Creating Booking..."
            : "Book Now"}
        </button>
      </div>
    </>
  );
}