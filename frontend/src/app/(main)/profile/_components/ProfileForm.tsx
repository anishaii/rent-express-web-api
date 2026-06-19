"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileSchema, UpdateProfileFormData } from "../_schema/schema";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/context/AuthContext";

export default function ProfileForm({ user }: { user: any }) {
  const { checkAuth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // controls view mode vs edit mode
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    // values keeps the form in sync with user prop whenever it changes (e.g. after revalidatePath refresh)
    values: {
      fullName: user?.fullName || "",
      contactNumber: user?.contactNumber || "",
    },
  });

  // shows a live preview of the selected image before it's uploaded
  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void,
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // exits edit mode without saving, resets form back to original values
  const handleCancel = () => {
    handleDismissImage();
    reset({
      fullName: user?.fullName || "",
      contactNumber: user?.contactNumber || "",
    });
    setIsEditing(false);
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("contactNumber", data.contactNumber);
    if (data.image) {
      formData.append("profileImage", data.image); // field name must match multer's uploads.single("profileImage")
    }

    const result = await handleUpdateProfile(formData);
    if (result.success) {
      toast.success("Profile updated successfully!", { duration: 1500 });
      handleDismissImage();
      await checkAuth(); // refresh navbar avatar/name with latest data
      setIsEditing(false); // go back to view mode after save
    } else {
      toast.error(result.message || "Profile update failed", { duration: 1500 });
    }
  };

  // image currently shown - either a fresh preview or the saved image from db
  const currentImageSrc =
    previewImage ||
    (user?.imageUrl ? process.env.NEXT_PUBLIC_BASE_URL + user.imageUrl : null);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mb-5">
      {/* Avatar + name/email header - always visible */}
      <div className="flex items-center gap-4 mb-8">
        <div
          onClick={() => isEditing && fileInputRef.current?.click()}
          className={`relative h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${
            isEditing ? "cursor-pointer ring-2 ring-cyan-500" : ""
          }`}
        >
          {currentImageSrc ? (
            <Image src={currentImageSrc} alt="Profile" fill className="object-cover"/>
          ) : (
            <UserIcon className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user?.fullName}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>

        {/* hidden file input, only triggered when editing */}
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
              className="hidden"
            />
          )}
        />
      </div>
      {errors.image && (
        <p className="text-sm text-red-600 -mt-6 mb-4">{errors.image.message}</p>
      )}

      <h3 className="font-semibold mb-4">Personal Information</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" disabled={!isEditing} {...register("fullName")} />
          {errors.fullName && (
            <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email || ""} disabled />
        </div>

        <div>
          <Label htmlFor="contactNumber">Phone Number</Label>
          <Input id="contactNumber" disabled={!isEditing} {...register("contactNumber")} />
          {errors.contactNumber && (
            <p className="text-sm text-red-600 mt-1">{errors.contactNumber.message}</p>
          )}
        </div>

        {/* Save/Cancel only shown in edit mode, kept inside form so submit works */}
        {isEditing && (
          <div className="mt-6 flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-600">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </form>

      {/* Edit Profile button - outside form, only shown in view mode */}
      {!isEditing && (
        <div className="mt-6">
          <Button type="button" className="bg-cyan-500 hover:bg-cyan-600" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}