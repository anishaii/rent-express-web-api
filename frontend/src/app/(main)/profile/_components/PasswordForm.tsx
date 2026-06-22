"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema, ChangePasswordFormData } from "../_schema/schema";
import { handleUpdateProfile } from "@/lib/actions/auth-action";

export default function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    // reuses the same update profile endpoint - backend verifies currentPassword before saving
    const formData = new FormData();
    formData.append("currentPassword", data.currentPassword);
    formData.append("password", data.newPassword);

    const result = await handleUpdateProfile(formData);
    if (result.success) {
      toast.success("Password updated successfully!", { duration: 1500 });
      reset(); // clear form after success
    } else {
      toast.error(result.message || "Password update failed", { duration: 1500 });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-6">
        Change Password
      </h3>
     

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-5">
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" {...register("currentPassword")} className="mt-1.5" />
          {errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" {...register("newPassword")} className="mt-1.5" />
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1.5" />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-600">
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}