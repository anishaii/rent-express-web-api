"use client";

import { useRouter } from "next/navigation";
import VehicleCard from "../vehicles/_components/VehicleCard";

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

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
}

export default function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  const router = useRouter();

  // show only first 8 available vehicles
  const featuredVehicles = vehicles
    .filter((v) => v.isAvailable)
    .slice(0, 8);

  return (
    <section className="px-14 py-12">
      {/* section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#13303a]">Featured Vehicles</h2>
          <p className="text-[#51636a] text-sm mt-1">
            Handpicked vehicles available for immediate booking
          </p>
        </div>
        <button
          onClick={() => router.push("/vehicles")}
          className="text-sm text-[#0092B8] hover:text-[#007a99] font-medium flex items-center gap-1"
        >
          View all vehicles →
        </button>
      </div>

      {/* vehicle grid - reuses VehicleCard so favourites work here too */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle._id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}