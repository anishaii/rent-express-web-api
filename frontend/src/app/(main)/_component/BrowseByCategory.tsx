"use client";

import { useRouter } from "next/navigation";
import {
  BikeIcon,
  CarIcon,
  TruckIcon,
  ZapIcon,
  CrownIcon,
  BusIcon,
  ScissorsIcon,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface BrowseByCategoryProps {
  categories: Category[];
}

// map category names to lucide icons
const getCategoryIcon = (name: string) => {
  switch (name) {
    case "Bike":
      return <BikeIcon className="h-7 w-7" />;
    case "Scooter":
      return <BikeIcon className="h-7 w-7" />;
    case "Car":
      return <CarIcon className="h-7 w-7" />;
    case "Van":
      return <BusIcon className="h-7 w-7" />;
    case "Pickup Truck":
      return <TruckIcon className="h-7 w-7" />;
    case "Luxury Car":
      return <CrownIcon className="h-7 w-7" />;
    case "Electric Vehicle":
      return <ZapIcon className="h-7 w-7" />;
    default:
      return <CarIcon className="h-7 w-7" />;
  }
};

// map category names to colors
const getCategoryColor = (name: string) => {
  switch (name) {
    case "Bike":
      return "bg-orange-50 text-orange-500 border-orange-100";
    case "Scooter":
      return "bg-pink-50 text-pink-500 border-pink-100";
    case "Car":
      return "bg-cyan-50 text-cyan-500 border-cyan-100";
    case "Van":
      return "bg-blue-50 text-blue-500 border-blue-100";
    case "Pickup Truck":
      return "bg-amber-50 text-amber-500 border-amber-100";
    case "Luxury Car":
      return "bg-purple-50 text-purple-500 border-purple-100";
    case "Electric Vehicle":
      return "bg-green-50 text-green-500 border-green-100";
    default:
      return "bg-gray-50 text-gray-500 border-gray-100";
  }
};

export default function BrowseByCategory({ categories }: BrowseByCategoryProps) {
  const router = useRouter();

  return (
    <section className="px-14 py-12 bg-gray-50">
      {/* section header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#13303a]">Browse by Category</h2>
        <p className="text-[#51636a] text-sm mt-1">
          Find the perfect vehicle for your needs
        </p>
      </div>

      {/* category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => router.push(`/vehicles?category=${category.name}`)}
            className={`flex flex-col items-center gap-3 border rounded-xl p-4 bg-white hover:shadow-md transition-all ${getCategoryColor(category.name)}`}
          >
            {/* category icon */}
            <div className={`h-12 w-12 rounded-full flex items-center justify-center border ${getCategoryColor(category.name)}`}>
              {getCategoryIcon(category.name)}
            </div>
            <span className="text-xs font-semibold text-[#13303a] text-center">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}