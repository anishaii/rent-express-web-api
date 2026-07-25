"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogInIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

interface BookingFormProps {
  vehicleId: string;
  isAvailable: boolean;
}

export default function BookingForm({
  vehicleId,
  isAvailable,
}: BookingFormProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    router.push(`/bookings/confirm?vehicleId=${vehicleId}`);
  };

  // determine button state: unavailable > admin > normal
  const isDisabled = !isAvailable || isAdmin;
  const buttonLabel = !isAvailable
    ? "Not Available"
    : isAdmin
      ? "Admins Cannot Book"
      : "Book Now";

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
              href={`/login?redirect=/vehicles/${vehicleId}`}
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

      {/* book now button */}
      <button
        onClick={handleBookNow}
        disabled={isDisabled}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
          isDisabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#0092B8] hover:bg-[#007a99] text-white"
        }`}
      >
        {buttonLabel}
      </button>
    </>
  );
}