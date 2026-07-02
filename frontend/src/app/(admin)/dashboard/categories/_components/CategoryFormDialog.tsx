"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  handleCreateCategory,
  handleUpdateCategory,
} from "@/lib/actions/admin/category-action";

// category name must match backend enum exactly
const CATEGORY_NAMES = [
  "Bike",
  "Scooter",
  "Car",
  "Van",
  "Pickup Truck",
  "Luxury Car",
  "Electric Vehicle",
] as const;

// category form schema
const categoryFormSchema = z.object({
  name: z.enum(CATEGORY_NAMES, { message: "Please select a category" }),
  description: z.string().min(1, "Description is required"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export default function CategoryFormDialog({
  open,
  onClose,
  category,
}: CategoryFormDialogProps) {
  const router = useRouter();
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: undefined,
      description: "",
    },
  });

  // prefill form when editing, reset when creating
  useEffect(() => {
    if (category) {
      reset({
        name: category.name as (typeof CATEGORY_NAMES)[number],
        description: category.description,
      });
    } else {
      reset({
        name: undefined,
        description: "",
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    const result = isEdit
      ? await handleUpdateCategory(category!._id, data)
      : await handleCreateCategory(data);

    if (result.success) {
      toast.success(
        isEdit ? "Category updated successfully!" : "Category created successfully!",
        { duration: 1500 },
      );
      onClose();
      router.refresh();
    } else {
      toast.error(result.message || "Something went wrong", { duration: 1500 });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Category Name - enum select */}
          <div>
            <Label>Category Name</Label>
            <Select
              onValueChange={(value) =>
                setValue("name", value as (typeof CATEGORY_NAMES)[number], {
                  shouldValidate: true,
                })
              }
              defaultValue={category?.name}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_NAMES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description")}
              className="mt-1.5"
              placeholder="Enter category description"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-500 hover:bg-cyan-600 flex-1"
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Category"
                  : "Create Category"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}