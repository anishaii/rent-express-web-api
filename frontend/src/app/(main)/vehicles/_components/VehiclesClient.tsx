"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import VehicleCard from "./VehicleCard";
import { Slider } from "@/components/ui/slider";
import { SearchIcon } from "lucide-react";

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

interface VehiclesClientProps {
  vehicles: Vehicle[];
  categories: Category[];
}

const VEHICLES_PER_PAGE = 8;

export default function VehiclesClient({ vehicles, categories }: VehiclesClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // get max price from vehicles for slider
  const maxPrice = useMemo(() => {
    if (vehicles.length === 0) return 10000;
    return Math.max(...vehicles.map((v) => v.pricePerDay));
  }, [vehicles]);

  // toggle category selection
  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
    setCurrentPage(1);
  };

  // filter vehicles based on search, category, price and availability
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.brandId?.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(vehicle.categoryId?.name);

      const matchesPrice =
        vehicle.pricePerDay >= priceRange[0] &&
        vehicle.pricePerDay <= priceRange[1];

      const matchesAvailability = !availableOnly || vehicle.isAvailable;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });
  }, [vehicles, search, selectedCategories, priceRange, availableOnly]);

  // pagination
  const totalPages = Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * VEHICLES_PER_PAGE,
    currentPage * VEHICLES_PER_PAGE,
  );

  return (
    <div className="flex gap-8">
      {/* sidebar filters */}
      <aside className="w-64 shrink-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
          <h2 className="text-base font-bold text-[#13303a] mb-6">Filters</h2>

          {/* search */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-2 block">
              Search
            </label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
              <SearchIcon className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search vehicles..."
                className="outline-none text-sm w-full text-[#13303a] placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* category filter */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-3 block">
              Category
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                    className="h-4 w-4 rounded accent-cyan-500"
                  />
                  <span className="text-sm text-[#13303a] group-hover:text-cyan-600 transition-colors">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* price range */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-3 block">
              Price Range
            </label>
            <Slider
              min={0}
              max={maxPrice}
              step={100}
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value);
                setCurrentPage(1);
              }}
              className="mb-2"
            />
            <div className="flex items-center justify-between text-xs text-[#8093a0]">
              <span>NPR {priceRange[0].toLocaleString()}</span>
              <span>NPR {priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* available only */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => {
                  setAvailableOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="h-4 w-4 rounded accent-cyan-500"
              />
              <span className="text-sm text-[#13303a] group-hover:text-cyan-600 transition-colors">
                Available only
              </span>
            </label>
          </div>

          {/* clear filters */}
          {(search || selectedCategories.length > 0 || availableOnly || priceRange[1] < maxPrice) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategories([]);
                setPriceRange([0, maxPrice]);
                setAvailableOnly(false);
                setCurrentPage(1);
              }}
              className="mt-6 w-full text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-xl py-2 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </aside>

      {/* main content */}
      <div className="flex-1">
        {/* results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#51636a]">
            <span className="font-semibold text-[#13303a]">
              {filteredVehicles.length}
            </span>{" "}
            vehicles found
          </p>
        </div>

        {/* empty state */}
        {paginatedVehicles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No vehicles found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* vehicle grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1.5 text-sm border rounded-lg ${
                      currentPage === i + 1
                        ? "bg-[#0092B8] text-white border-[#0092B8]"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}