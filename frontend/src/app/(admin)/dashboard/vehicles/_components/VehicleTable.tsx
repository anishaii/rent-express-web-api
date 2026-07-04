"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, SearchIcon, PencilIcon, PlusIcon, EyeIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { handleDeleteVehicle, handleUpdateVehicle } from "@/lib/actions/admin/vehicle-action";

interface Brand {
  _id: string;
  name: string;
  logoUrl?: string;
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
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  pagination: Pagination;
  search: string;
}

export default function VehicleTable({ vehicles, pagination, search }: VehicleTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search);
  const [isPending, startTransition] = useTransition();

  // handle search - wraps router.push in transition so it doesn't block UI
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    startTransition(() => {
      router.push(`/dashboard/vehicles?page=1&search=${value}`);
    });
  };

  // handle page change - updates url with new page number
  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/vehicles?page=${newPage}&search=${searchTerm}`);
  };

  // handle delete - calls action and shows toast
  const handleDelete = async (id: string) => {
    const result = await handleDeleteVehicle(id);
    if (result.success) {
      toast.success("Vehicle deleted successfully", { duration: 1500 });
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete vehicle", { duration: 1500 });
    }
  };

  // handle availability toggle - immediately updates via API
  const handleAvailabilityToggle = async (vehicle: Vehicle) => {
    const formData = new FormData();
    formData.append("isAvailable", String(!vehicle.isAvailable));

    const result = await handleUpdateVehicle(vehicle._id, formData);
    if (result.success) {
      toast.success(
        !vehicle.isAvailable ? "Vehicle marked as available" : "Vehicle marked as unavailable",
        { duration: 1500 },
      );
      router.refresh();
    } else {
      toast.error(result.message || "Failed to update availability", { duration: 1500 });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Search Bar + Add Vehicle Button */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 flex-1 mr-4 ${isPending ? "opacity-60" : ""}`}>
          <SearchIcon className="h-4 w-4 text-gray-400 flex-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search vehicles..."
            className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <Button
          onClick={() => router.push("/dashboard/vehicles/new")}
          className="bg-cyan-500 hover:bg-cyan-600 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Empty State */}
      {vehicles.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No vehicles found.
        </div>
      ) : (
        <>
          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Photo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Vehicle Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Brand</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price/Day</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Availability</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id} className="border-b border-gray-50 hover:bg-gray-50">
                  {/* vehicle image or fallback initial */}
                  <td className="py-4 px-4">
                    {vehicle.imageUrl ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${vehicle.imageUrl}`}
                        alt={vehicle.name}
                        className="h-12 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 font-semibold text-sm">
                        {vehicle.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-800">
                    {vehicle.name}
                  </td>
                  {/* show brand name from populated brandId */}
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {vehicle.brandId?.name || "—"}
                  </td>
                  {/* show category name from populated categoryId */}
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {vehicle.categoryId?.name || "—"}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-800">
                    NPR {vehicle.pricePerDay.toLocaleString()}
                  </td>
                  {/* availability toggle - clicks immediately update API */}
                  <td className="py-4 px-4">
                    <Switch
                      checked={vehicle.isAvailable}
                      onCheckedChange={() => handleAvailabilityToggle(vehicle)}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* view vehicle detail */}
                      <button
                        onClick={() => router.push(`/dashboard/vehicles/${vehicle._id}`)}
                        className="text-cyan-500 hover:text-cyan-600"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>

                      {/* edit vehicle */}
                      <button
                        onClick={() => router.push(`/dashboard/vehicles/edit/${vehicle._id}`)}
                        className="text-cyan-500 hover:text-cyan-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>

                      {/* delete vehicle with confirmation */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-red-500 hover:text-red-600">
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this vehicle?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete{" "}
                              <strong>{vehicle.name}</strong>. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(vehicle._id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} vehicles
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1.5 text-sm border rounded-lg ${
                      pagination.page === i + 1
                        ? "bg-cyan-500 text-white border-cyan-500"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}