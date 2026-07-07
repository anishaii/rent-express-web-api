"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeartIcon, UsersIcon, FuelIcon, ZapIcon } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Vehicle {
  _id: string;
  name: string;
  brandId: Brand;
  categoryId: Category;
  pricePerDay: number;
  imageUrl?: string;
  fuelType: string;
  seats: number;
  transmission: string;
  isAvailable: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/vehicles/${vehicle._id}`)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group"
    >
      {/* vehicle image */}
      <div className="relative h-44 bg-gray-100">
        {vehicle.imageUrl ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${vehicle.imageUrl}`}
            alt={vehicle.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-bold text-4xl">
            {vehicle.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#0092B8] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {vehicle.categoryId?.name}
          </span>
        </div>

        {/* unavailable badge */}
        {!vehicle.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Unavailable
            </span>
          </div>
        )}

        {/* favourite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // wire to favourite API later
          }}
          className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
        >
          <HeartIcon className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* vehicle info */}
      <div className="p-4">
        <p className="text-xs text-[#0092B8] font-semibold mb-1">
          {vehicle.brandId?.name}
        </p>
        <h3 className="text-base font-bold text-[#13303a] mb-3">
          {vehicle.name}
        </h3>

        {/* vehicle specs */}
        <div className="flex items-center gap-3 text-xs text-[#51636a] mb-4">
          <span className="flex items-center gap-1">
            <UsersIcon className="h-3.5 w-3.5" />
            {vehicle.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <FuelIcon className="h-3.5 w-3.5" />
            {vehicle.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <ZapIcon className="h-3.5 w-3.5" />
            {vehicle.transmission}
          </span>
        </div>

        {/* price + rent button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#13303a]">
              NPR {vehicle.pricePerDay.toLocaleString()}
            </span>
            <span className="text-xs text-[#8093a0]"> / day</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vehicles/${vehicle._id}`);
            }}
            className="bg-[#0092B8] hover:bg-[#007a99] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
}