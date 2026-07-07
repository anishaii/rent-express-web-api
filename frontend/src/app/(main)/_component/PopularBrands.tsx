"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Brand {
  _id: string;
  name: string;
  logoUrl?: string;
}

interface PopularBrandsProps {
  brands: Brand[];
}

export default function PopularBrands({ brands }: PopularBrandsProps) {
  const router = useRouter();

  return (
    <section className="px-14 py-12">
      {/* section header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#13303a]">Popular Brands</h2>
        <p className="text-[#51636a] text-sm mt-1">
          Explore vehicles from top brands available for rent
        </p>
      </div>

      {/* brands horizontal scroll */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {brands.map((brand) => (
          <button
            key={brand._id}
            onClick={() => router.push(`/vehicles?brand=${brand._id}`)}
            className="flex flex-col items-center gap-2 border border-gray-200 rounded-xl px-6 py-4 bg-white hover:border-cyan-400 hover:shadow-sm transition-all shrink-0 min-w-30"
          >
            {/* brand logo or initial fallback */}
            {brand.logoUrl ? (
              <div className="relative h-10 w-16">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${brand.logoUrl}`}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="h-10 w-16 flex items-center justify-center bg-cyan-50 rounded-lg text-cyan-600 font-bold text-lg">
                {brand.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-medium text-[#13303a]">
              {brand.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}