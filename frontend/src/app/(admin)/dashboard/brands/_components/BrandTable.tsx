"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, SearchIcon, PencilIcon, PlusIcon } from "lucide-react";
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

import { handleDeleteBrand } from "@/lib/actions/admin/brand-action";
import BrandFormDialog from "./BrandFormDialog";

interface Brand {
  _id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BrandTableProps {
  brands: Brand[];
  pagination: Pagination;
  search: string;
}

export default function BrandTable({ brands, pagination, search }: BrandTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isPending, startTransition] = useTransition();

  // handle search - wraps router.push in transition so it doesn't block UI
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    startTransition(() => {
      router.push(`/dashboard/brands?page=1&search=${value}`);
    });
  };

  // handle page change - updates url with new page number
  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/brands?page=${newPage}&search=${searchTerm}`);
  };

  // handle delete - calls action and shows toast
  const handleDelete = async (id: string) => {
    const result = await handleDeleteBrand(id);
    if (result.success) {
      toast.success("Brand deleted successfully", { duration: 1500 });
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete brand", { duration: 1500 });
    }
  };

  // open dialog in edit mode with selected brand prefilled
  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setDialogOpen(true);
  };

  // open dialog in create mode with empty form
  const handleCreate = () => {
    setSelectedBrand(null);
    setDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Search Bar + Add Brand Button */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 flex-1 mr-4 ${isPending ? "opacity-60" : ""}`}>
          <SearchIcon className="h-4 w-4 text-gray-400 flex-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search brands..."
            className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="bg-cyan-500 hover:bg-cyan-600 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {/* Empty State */}
      {brands.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No brands found.
        </div>
      ) : (
        <>
          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Logo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand._id} className="border-b border-gray-50 hover:bg-gray-50">
                  {/* brand logo or fallback initial */}
                  <td className="py-4 px-4">
                    {brand.logoUrl ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${brand.logoUrl}`}
                        alt={brand.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold text-sm">
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-800">
                    {brand.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* edit brand */}
                      <button
                        onClick={() => handleEdit(brand)}
                        className="text-cyan-500 hover:text-cyan-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>

                      {/* delete brand with confirmation */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-red-500 hover:text-red-600">
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this brand?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete{" "}
                              <strong>{brand.name}</strong>. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(brand._id)}
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
                {pagination.total} brands
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

      {/* Create/Edit brand dialog */}
      <BrandFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        brand={selectedBrand}
      />
    </div>
  );
}