import { handleGetVehicleById } from "@/lib/actions/admin/vehicle-action";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "lucide-react";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await handleGetVehicleById(id);

  if (!result.success) {
    throw new Error(result.message);
  }

  if (!result.data) {
    notFound();
  }

  const vehicle = result.data;

  return (
    <div className="p-6 max-w-4xl">
      {/* Back link */}
      <Link
        href="/dashboard/vehicles"
        className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Vehicles
      </Link>

      {/* Vehicle Detail Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-semibold mb-6">Vehicle Details</h2>

        {/* Vehicle image + name header */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
          <div className="relative h-32 w-48 rounded-xl overflow-hidden bg-gray-100 flex-0">
            {vehicle.imageUrl ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${vehicle.imageUrl}`}
                alt={vehicle.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-semibold text-2xl">
                {vehicle.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{vehicle.description}</p>
            {/* availability badge */}
            <span className={`inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full ${
              vehicle.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}>
              {vehicle.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Vehicle info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-1">Brand</p>
            <p className="text-gray-800 font-medium">{vehicle.brandId?.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-1">Category</p>
            <p className="text-gray-800">{vehicle.categoryId?.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-1">Price Per Day</p>
            <p className="text-gray-800">NPR {vehicle.pricePerDay.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-1">Fuel Type</p>
            <p className="text-gray-800">{vehicle.fuelType}</p>
          </div>
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-1">Seats</p>
            <p className="text-gray-800">{vehicle.seats} seats</p>
          </div>
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-1">Transmission</p>
            <p className="text-gray-800">{vehicle.transmission}</p>
          </div>
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-1">Added On</p>
            <p className="text-gray-800">
              {new Date(vehicle.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-1">Last Updated</p>
            <p className="text-gray-800">
              {new Date(vehicle.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}