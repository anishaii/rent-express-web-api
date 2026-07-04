import { handleGetPublicBrands } from "@/lib/actions/public/brand-action";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";
import VehicleForm from "./_components/VehicleForm";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function NewVehiclePage() {
  // fetch brands and categories for form dropdowns
  const [brandsResult, categoriesResult] = await Promise.all([
    handleGetPublicBrands(),
    handleGetPublicCategories(),
  ]);

  if (!brandsResult.success || !categoriesResult.success) {
    throw new Error("Failed to load form data");
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* Back link */}
      <Link
        href="/dashboard/vehicles"
        className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Vehicles
      </Link>

      <h1 className="text-xl text-slate-600 font-medium mb-6">
        Add New Vehicle
      </h1>

      <VehicleForm
        brands={brandsResult.data}
        categories={categoriesResult.data}
      />
    </div>
  );
}