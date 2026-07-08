"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { MapPinIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  _id: string;
  name: string;
  imageUrl?: string;
  pricePerDay: number;
  categoryId: { name: string };
  brandId: { name: string };
}

export default function ReviewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;

  // redirect back if missing required params
  useEffect(() => {
    if (!vehicleId || !startDateParam || !endDateParam) {
      router.push("/vehicles");
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicle/${vehicleId}`,
        );
        const data = await response.json();
        if (data.success) {
          setVehicle(data.data);
        } else {
          router.push("/vehicles");
        }
      } catch (error) {
        router.push("/vehicles");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId, startDateParam, endDateParam, router]);

  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalPrice = vehicle ? totalDays * vehicle.pricePerDay : 0;

  // create the actual booking
  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const { getTokenCookie } = await import("@/lib/cookies");
      const token = await getTokenCookie();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vehicleId,
            startDate: startDateParam,
            endDate: endDateParam,
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Booking confirmed successfully!", { duration: 1500 });
        router.push(`/bookings/confirmed?bookingId=${data.data._id}`);
      } else {
        toast.error(data.message || "Booking failed", { duration: 1500 });
      }
    } catch (error) {
      toast.error("Something went wrong", { duration: 1500 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 sm:px-14 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="px-6 sm:px-14 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#13303a] mb-2">
        Review Your Booking
      </h1>
      <p className="text-sm text-[#51636a] mb-8">
        Please review your booking details before confirming
      </p>

      {/* vehicle summary card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <div className="flex items-start gap-4">
          {/* vehicle image */}
          <div className="relative h-24 w-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
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
          <div>
            <p className="text-xs text-[#0092B8] font-semibold mb-1">
              {vehicle.brandId?.name}
            </p>
            <h2 className="text-lg font-bold text-[#13303a]">
              {vehicle.name}
            </h2>
            <p className="text-xs text-[#8093a0] mt-1">
              {vehicle.categoryId?.name}
            </p>
          </div>
        </div>
      </div>

      {/* rental period card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <h3 className="text-sm font-bold text-[#13303a] mb-4">
          Rental Period
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
              <CalendarIcon className="h-4 w-4 text-[#0092B8]" />
            </div>
            <div>
              <p className="text-xs text-[#8093a0]">Pick-up</p>
              <p className="text-sm font-semibold text-[#13303a]">
                {startDate?.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
              <CalendarIcon className="h-4 w-4 text-[#0092B8]" />
            </div>
            <div>
              <p className="text-xs text-[#8093a0]">Drop-off</p>
              <p className="text-sm font-semibold text-[#13303a]">
                {endDate?.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
              <ClockIcon className="h-4 w-4 text-[#0092B8]" />
            </div>
            <div>
              <p className="text-xs text-[#8093a0]">Duration</p>
              <p className="text-sm font-semibold text-[#13303a]">
                {totalDays} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* pickup location card */}
      <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5 mb-4">
        <div className="flex items-start gap-3">
          <MapPinIcon className="h-5 w-5 text-[#0092B8] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#13303a]">
              Pickup Location
            </p>
            <p className="text-xs text-[#51636a] mt-1">
              New Baneshwor, Kathmandu, Nepal
            </p>
          </div>
        </div>
      </div>

      {/* payment summary card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-bold text-[#13303a] mb-4">
          Payment Summary
        </h3>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[#51636a]">
            NPR {vehicle.pricePerDay.toLocaleString()} × {totalDays} days
          </span>
          <span className="text-[#13303a] font-medium">
            NPR {totalPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <span className="text-base font-bold text-[#13303a]">Total</span>
          <span className="text-xl font-bold text-[#0092B8]">
            NPR {totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* action buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 border border-gray-200 text-[#51636a] hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirmBooking}
          disabled={submitting}
          className="flex-1 bg-[#0092B8] hover:bg-[#007a99] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {submitting ? "Confirming..." : "Confirm & Book"}
        </button>
      </div>
    </div>
  );
}