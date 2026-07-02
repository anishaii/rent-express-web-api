"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
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

import { handleCreateBrand, handleUpdateBrand } from "@/lib/actions/admin/brand-action";

// brand form schema - name required, logo optional
const brandFormSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoImage: z.any().optional(),
});

type BrandFormData = z.infer<typeof brandFormSchema>;

interface Brand {
  _id: string;
  name: string;
  logoUrl?: string;
}

interface BrandFormDialogProps {
  open: boolean;
  onClose: () => void;
  brand?: Brand | null;
}

export default function BrandFormDialog({ open, onClose, brand }: BrandFormDialogProps) {
  const router = useRouter();
  const isEdit = !!brand;

  // preview state for logo image
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
    },
  });

  // prefill form when editing, reset when creating
  useEffect(() => {
    if (brand) {
      reset({ name: brand.name });
      // show existing logo as preview when editing
      setLogoPreview(
        brand.logoUrl
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${brand.logoUrl}`
          : null
      );
    } else {
      reset({ name: "" });
      setLogoPreview(null);
    }
  }, [brand, reset]);

  // show preview when user picks a new image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BrandFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);

    // only append logo if a new file was selected
    const fileInput = document.getElementById("logoImage") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("logoImage", fileInput.files[0]);
    }

    const result = isEdit
      ? await handleUpdateBrand(brand!._id, formData)
      : await handleCreateBrand(formData);

    if (result.success) {
      toast.success(
        isEdit ? "Brand updated successfully!" : "Brand created successfully!",
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
          <DialogTitle>{isEdit ? "Edit Brand" : "Add New Brand"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Brand Name */}
          <div>
            <Label htmlFor="name">Brand Name</Label>
            <Input id="name" {...register("name")} className="mt-1.5" />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Logo Image Upload */}
          <div>
            <Label htmlFor="logoImage">Logo Image (optional)</Label>
            <Input
              id="logoImage"
              type="file"
              accept="image/*"
              className="mt-1.5"
              onChange={handleImageChange}
            />
          </div>

          {/* Logo Preview */}
          {logoPreview && (
            <div className="flex items-center gap-3">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="h-16 w-16 rounded-full object-cover border border-gray-200"
              />
              <p className="text-sm text-gray-500">Logo preview</p>
            </div>
          )}

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
                  ? "Update Brand"
                  : "Create Brand"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}