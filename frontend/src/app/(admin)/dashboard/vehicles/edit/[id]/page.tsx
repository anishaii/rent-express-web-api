import { handleGetVehicleById } from "@/lib/actions/admin/vehicle-action";
import { handleGetPublicBrands } from "@/lib/actions/public/brand-action";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";
import VehicleForm from "../../_components/VehicleForm";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // fetch vehicle, brands and categories in parallel
  const [vehicleResult, brandsResult, categoriesResult] = await Promise.all([
    handleGetVehicleById(id),
    handleGetPublicBrands(),
    handleGetPublicCategories(),
  ]);

  if (!vehicleResult.success) {
    throw new Error(vehicleResult.message);
  }

  if (!vehicleResult.data) {
    notFound();
  }

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
        Edit Vehicle
      </h1>

      <VehicleForm
        brands={brandsResult.data}
        categories={categoriesResult.data}
        vehicle={vehicleResult.data}
      />
    </div>
  );
}