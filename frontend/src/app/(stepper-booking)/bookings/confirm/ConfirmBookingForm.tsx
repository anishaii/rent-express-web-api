"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { handleGetPublicVehicleById } from "@/lib/actions/public/vehicle-action";

interface Vehicle {
  _id: string;
  name: string;
  imageUrl?: string;
  pricePerDay: number;
  categoryId: { name: string };
}

export default function ConfirmBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  useEffect(() => {
    if (!vehicleId) {
      router.push("/vehicles");
      return;
    }

    const fetchVehicle = async () => {
      const result = await handleGetPublicVehicleById(vehicleId);
      if (result.success) {
        setVehicle(result.data);
      } else {
        router.push("/vehicles");
      }
      setLoading(false);
    };
    fetchVehicle();
  }, [vehicleId, router]);

  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalPrice = vehicle ? totalDays * vehicle.pricePerDay : 0;

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      toast.error("Please select pickup and drop-off dates", { duration: 1500 });
      return;
    }
    if (endDate <= startDate) {
      toast.error("Drop-off date must be after pickup date", { duration: 1500 });
      return;
    }

    const params = new URLSearchParams({
      vehicleId: vehicleId!,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    router.push(`/bookings/review?${params.toString()}`);
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
    <div className="px-6 sm:px-14 py-10">
      <h1 className="text-2xl font-bold text-[#13303a] mb-8">
        Complete Your Booking
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="text-base font-bold text-[#13303a] mb-5">
              Rental Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-1.5 block">
                  Pick-up Date
                </label>
                <Popover open={startOpen} onOpenChange={setStartOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 text-sm text-left hover:border-cyan-400 transition-colors">
                      <CalendarIcon className="h-4 w-4 text-[#0092B8] shrink-0" />
                      <span className={startDate ? "text-[#13303a]" : "text-[#8093a0]"}>
                        {startDate ? startDate.toLocaleDateString() : "mm/dd/yyyy"}
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

              <div>
                <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-1.5 block">
                  Drop-off Date
                </label>
                <Popover open={endOpen} onOpenChange={setEndOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 text-sm text-left hover:border-cyan-400 transition-colors">
                      <CalendarIcon className="h-4 w-4 text-[#0092B8] shrink-0" />
                      <span className={endDate ? "text-[#13303a]" : "text-[#8093a0]"}>
                        {endDate ? endDate.toLocaleDateString() : "mm/dd/yyyy"}
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
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 text-[#0092B8] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#13303a]">
                  Pickup Location
                </p>
                <p className="text-xs text-[#51636a] mt-1">
                  New Baneshwor, Kathmandu, Nepal
                </p>
                <p className="text-xs text-[#8093a0] mt-1">
                  Mon - Sat: 8:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-[#0092B8] hover:bg-[#007a99] text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            Confirm Booking
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-6">
            <h2 className="text-base font-bold text-[#13303a] mb-5">
              Booking Summary
            </h2>

            <div className="relative h-36 rounded-xl overflow-hidden bg-gray-100 mb-4">
              {vehicle.imageUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${vehicle.imageUrl}`}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-bold text-3xl">
                  {vehicle.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-[#13303a]">
              {vehicle.name}
            </h3>
            <p className="text-xs text-[#8093a0] mb-4">
              {vehicle.categoryId?.name}
            </p>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#51636a]">Price per day</span>
                <span className="text-[#13303a] font-medium">
                  NPR {vehicle.pricePerDay.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#51636a]">Duration</span>
                <span className="text-[#13303a] font-medium">
                  {totalDays} days
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <span className="text-sm font-bold text-[#13303a]">
                Total Price
              </span>
              <span className="text-xl font-bold text-[#0092B8]">
                NPR {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}