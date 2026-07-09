"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeartIcon, Trash2Icon, UsersIcon, FuelIcon, ZapIcon } from "lucide-react";
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

interface Vehicle {
  _id: string;
  name: string;
  imageUrl?: string;
  pricePerDay: number;
  fuelType: string;
  seats: number;
  transmission: string;
  isAvailable: boolean;
  categoryId: { name: string };
  brandId: { name: string };
}

interface Favourite {
  _id: string;
  vehicleId: Vehicle;
}

export default function FavouritesPage() {
  const router = useRouter();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch user favourites on mount
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const { getTokenCookie } = await import("@/lib/cookies");
        const token = await getTokenCookie();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourite/my-favourites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setFavourites(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch favourites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  // remove from favourites
  const handleRemove = async (vehicleId: string) => {
    try {
      const { getTokenCookie } = await import("@/lib/cookies");
      const token = await getTokenCookie();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourite/remove/${vehicleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setFavourites((prev) =>
          prev.filter((fav) => fav.vehicleId._id !== vehicleId),
        );
        toast.success("Removed from favourites", { duration: 1500 });
      }
    } catch (error) {
      toast.error("Failed to remove favourite", { duration: 1500 });
    }
  };

  if (loading) {
    return (
      <div className="px-6 sm:px-14 py-10">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-14 py-10">
      {/* header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center">
          <HeartIcon className="h-5 w-5 text-red-500 fill-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#13303a]">My Favourites</h1>
          <p className="text-sm text-[#8093a0]">
            {favourites.length} vehicle{favourites.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {/* empty state */}
      {favourites.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartIcon className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-[#13303a] mb-2">
            No favourites yet
          </h2>
          <p className="text-sm text-[#8093a0] mb-6">
            Start exploring and save vehicles you love
          </p>
          <button
            onClick={() => router.push("/vehicles")}
            className="bg-[#0092B8] hover:bg-[#007a99] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Vehicles
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {favourites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-all"
            >
              {/* vehicle image */}
              <div
                className="relative h-24 w-32 rounded-xl overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                onClick={() => router.push(`/vehicles/${fav.vehicleId._id}`)}
              >
                {fav.vehicleId.imageUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${fav.vehicleId.imageUrl}`}
                    alt={fav.vehicleId.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-bold text-2xl">
                    {fav.vehicleId.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* vehicle info */}
              <div
                className="flex-1 cursor-pointer"
                onClick={() => router.push(`/vehicles/${fav.vehicleId._id}`)}
              >
                <p className="text-xs text-[#0092B8] font-semibold mb-0.5">
                  {fav.vehicleId.brandId?.name}
                </p>
                <h3 className="text-base font-bold text-[#13303a] mb-1">
                  {fav.vehicleId.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#51636a] mb-2">
                  <span className="flex items-center gap-1">
                    <UsersIcon className="h-3 w-3" />
                    {fav.vehicleId.seats} seats
                  </span>
                  <span className="flex items-center gap-1">
                    <FuelIcon className="h-3 w-3" />
                    {fav.vehicleId.fuelType}
                  </span>
                  <span className="flex items-center gap-1">
                    <ZapIcon className="h-3 w-3" />
                    {fav.vehicleId.transmission}
                  </span>
                </div>
                <p className="text-base font-bold text-[#13303a]">
                  NPR {fav.vehicleId.pricePerDay.toLocaleString()}
                  <span className="text-xs text-[#8093a0] font-normal"> / day</span>
                </p>
              </div>

              {/* availability badge */}
              <div className="shrink-0 hidden sm:block">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  fav.vehicleId.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {fav.vehicleId.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* book now */}
                <button
                  onClick={() => router.push(`/vehicles/${fav.vehicleId._id}`)}
                  className="bg-[#0092B8] hover:bg-[#007a99] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Book Now
                </button>

                {/* remove from favourites */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="h-8 w-8 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                      <Trash2Icon className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove from favourites?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove{" "}
                        <strong>{fav.vehicleId.name}</strong> from your
                        favourites list.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemove(fav.vehicleId._id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}