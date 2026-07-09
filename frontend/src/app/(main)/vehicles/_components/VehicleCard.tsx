"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeartIcon, UsersIcon, FuelIcon, ZapIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";

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
  const { isAuthenticated } = useAuth();
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // check if vehicle is already favourited on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkFavourite = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourite/check/${vehicle._id}`,
          {
            headers: {
              Authorization: `Bearer ${await (await import("@/lib/cookies")).getTokenCookie()}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setIsFavourited(data.data.isFavourited);
        }
      } catch (error) {
        console.error("Failed to check favourite:", error);
      }
    };
    checkFavourite();
  }, [vehicle._id, isAuthenticated]);

  // handle heart toggle
  const handleFavouriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // show toast if not logged in
    if (!isAuthenticated) {
      toast.error("Please login to add favourites", { duration: 1500 });
      return;
    }

    setIsLoading(true);
    try {
      const { getTokenCookie } = await import("@/lib/cookies");
      const token = await getTokenCookie();

      if (isFavourited) {
        // remove from favourites
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourite/remove/${vehicle._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setIsFavourited(false);
          toast.success("Removed from favourites", { duration: 1500 });
        }
      } else {
        // add to favourites
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourite/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ vehicleId: vehicle._id }),
          },
        );
        const data = await response.json();
        if (data.success) {
          setIsFavourited(true);
          toast.success("Added to favourites!", { duration: 1500 });
        } else {
          toast.error(data.message || "Failed to add favourite", {
            duration: 1500,
          });
        }
      }
    } catch (error) {
      toast.error("Something went wrong", { duration: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* favourite button - red when favourited */}
        <button
          onClick={handleFavouriteToggle}
          disabled={isLoading}
          className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${
            isFavourited
              ? "bg-red-50 hover:bg-red-100"
              : "bg-white hover:bg-red-50"
          }`}
        >
          <HeartIcon
            className={`h-4 w-4 transition-colors ${
              isFavourited
                ? "text-red-500 fill-red-500"
                : "text-gray-400"
            }`}
          />
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