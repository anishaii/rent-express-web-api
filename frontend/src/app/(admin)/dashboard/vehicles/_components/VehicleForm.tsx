"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleCreateVehicle, handleUpdateVehicle } from "@/lib/actions/admin/vehicle-action";

const vehicleFormSchema = z.object({
  name: z.string().min(1, "Vehicle name is required"),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  pricePerDay: z.string().min(1, "Price is required"),
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"], {
    message: "Please select a fuel type",
  }),
  seats: z.string().min(1, "Seats is required"),
  transmission: z.enum(["Manual", "Automatic"], {
    message: "Please select a transmission",
  }),
  isAvailable: z.boolean(),
});

type VehicleFormData = z.infer<typeof vehicleFormSchema>;

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
  description: string;
  pricePerDay: number;
  fuelType: string;
  seats: number;
  transmission: string;
  isAvailable: boolean;
  imageUrl?: string;
}

interface VehicleFormProps {
  brands: Brand[];
  categories: Category[];
  vehicle?: Vehicle | null; // if provided, form is in edit mode
}

export default function VehicleForm({ brands, categories, vehicle }: VehicleFormProps) {
  const router = useRouter();
  const isEdit = !!vehicle;
  const [imagePreview, setImagePreview] = useState<string | null>(
    vehicle?.imageUrl
      ? `${process.env.NEXT_PUBLIC_BASE_URL}${vehicle.imageUrl}`
      : null,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: vehicle?.name || "",
      brandId: vehicle?.brandId?._id || "",
      categoryId: vehicle?.categoryId?._id || "",
      description: vehicle?.description || "",
      pricePerDay: vehicle?.pricePerDay?.toString() || "",
      fuelType: (vehicle?.fuelType as any) || undefined,
      seats: vehicle?.seats?.toString() || "",
      transmission: (vehicle?.transmission as any) || undefined,
      isAvailable: vehicle?.isAvailable ?? true,
    },
  });

  const isAvailable = watch("isAvailable");

  // show preview when user picks a new image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("brandId", data.brandId);
    formData.append("categoryId", data.categoryId);
    formData.append("description", data.description);
    formData.append("pricePerDay", data.pricePerDay);
    formData.append("fuelType", data.fuelType);
    formData.append("seats", data.seats);
    formData.append("transmission", data.transmission);
    formData.append("isAvailable", String(data.isAvailable));

    // only append image if a new file was selected
    const fileInput = document.getElementById("vehicleImage") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("vehicleImage", fileInput.files[0]);
    }

    const result = isEdit
      ? await handleUpdateVehicle(vehicle!._id, formData)
      : await handleCreateVehicle(formData);

    if (result.success) {
      toast.success(
        isEdit ? "Vehicle updated successfully!" : "Vehicle created successfully!",
        { duration: 1500 },
      );
      router.push("/dashboard/vehicles");
      router.refresh();
    } else {
      toast.error(result.message || "Something went wrong", { duration: 1500 });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Vehicle Name */}
        <div>
          <Label htmlFor="name">Vehicle Name</Label>
          <Input id="name" {...register("name")} className="mt-1.5" placeholder="e.g. Toyota Corolla" />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Brand + Category row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Brand */}
          <div>
            <Label>Brand</Label>
            <Select
              onValueChange={(value) => setValue("brandId", value, { shouldValidate: true })}
              defaultValue={vehicle?.brandId?._id}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brandId && (
              <p className="text-sm text-red-600 mt-1">{errors.brandId.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              onValueChange={(value) => setValue("categoryId", value, { shouldValidate: true })}
              defaultValue={vehicle?.categoryId?._id}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register("description")}
            rows={3}
            placeholder="Enter vehicle description"
            className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Price + Seats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pricePerDay">Price Per Day (NPR)</Label>
            <Input
              id="pricePerDay"
              type="number"
              {...register("pricePerDay")}
              className="mt-1.5"
              placeholder="e.g. 2500"
            />
            {errors.pricePerDay && (
              <p className="text-sm text-red-600 mt-1">{errors.pricePerDay.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="seats">Seats</Label>
            <Input
              id="seats"
              type="number"
              {...register("seats")}
              className="mt-1.5"
              placeholder="e.g. 5"
            />
            {errors.seats && (
              <p className="text-sm text-red-600 mt-1">{errors.seats.message}</p>
            )}
          </div>
        </div>

        {/* Fuel Type + Transmission row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fuel Type */}
          <div>
            <Label>Fuel Type</Label>
            <Select
              onValueChange={(value) => setValue("fuelType", value as any, { shouldValidate: true })}
              defaultValue={vehicle?.fuelType}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {errors.fuelType && (
              <p className="text-sm text-red-600 mt-1">{errors.fuelType.message}</p>
            )}
          </div>

          {/* Transmission */}
          <div>
            <Label>Transmission</Label>
            <Select
              onValueChange={(value) => setValue("transmission", value as any, { shouldValidate: true })}
              defaultValue={vehicle?.transmission}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
              </SelectContent>
            </Select>
            {errors.transmission && (
              <p className="text-sm text-red-600 mt-1">{errors.transmission.message}</p>
            )}
          </div>
        </div>

        {/* Vehicle Image */}
        <div>
          <Label htmlFor="vehicleImage">
            {isEdit ? "Update Image (optional)" : "Vehicle Image (optional)"}
          </Label>
          <Input
            id="vehicleImage"
            type="file"
            accept="image/*"
            className="mt-1.5"
            onChange={handleImageChange}
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="flex items-center gap-3">
            <img
              src={imagePreview}
              alt="Vehicle preview"
              className="h-24 w-36 rounded-lg object-cover border border-gray-200"
            />
            <p className="text-sm text-gray-500">Image preview</p>
          </div>
        )}

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Switch
            checked={isAvailable}
            onCheckedChange={(checked) => setValue("isAvailable", checked)}
            className="data-[state=checked]:bg-cyan-500"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Available for rent</p>
            <p className={`text-xs mt-0.5 ${isAvailable ? "text-green-600" : "text-red-500"}`}>
              {isAvailable ? "This vehicle is available for booking" : "This vehicle is not available"}
            </p>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-500 hover:bg-cyan-600 flex-1"
          >
            {isSubmitting
              ? isEdit ? "Updating..." : "Creating..."
              : isEdit ? "Update Vehicle" : "Save Vehicle"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/vehicles")}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}