"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, PencilIcon, PlusIcon } from "lucide-react";
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
import CategoryFormDialog from "./CategoryFormDialog";
import { handleDeleteCategory } from "@/lib/actions/admin/category-action";

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface CategoryTableProps {
  categories: Category[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // handle delete - calls action and shows toast
  const handleDelete = async (id: string) => {
    const result = await handleDeleteCategory(id);
    if (result.success) {
      toast.success("Category deleted successfully", { duration: 1500 });
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete category", { duration: 1500 });
    }
  };

  // open dialog in edit mode with selected category prefilled
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  // open dialog in create mode with empty form
  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header + Add Category Button */}
      <div className="flex items-center justify-end mb-6">
        <Button
          onClick={handleCreate}
          className="bg-cyan-500 hover:bg-cyan-600 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No categories found.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm font-medium text-gray-800">
                  {category.name}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  {category.description}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {/* edit category */}
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-cyan-500 hover:text-cyan-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>

                    {/* delete category with confirmation */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-500 hover:text-red-600">
                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this category?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete{" "}
                            <strong>{category.name}</strong>. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category._id)}
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
      )}

      {/* Create/Edit category dialog */}
      <CategoryFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}