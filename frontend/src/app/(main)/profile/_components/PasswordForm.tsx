"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema, ChangePasswordFormData } from "../_schema/schema";
import { handleUpdateProfile } from "@/lib/actions/auth-action";

export default function PasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    const formData = new FormData();
    formData.append("currentPassword", data.currentPassword);
    formData.append("password", data.newPassword);

    const result = await handleUpdateProfile(formData);
    if (result.success) {
      toast.success("Password updated successfully!", { duration: 1500 });
      reset();
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
          <div className="relative mt-1.5">
            <Input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative mt-1.5">
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              {...register("newPassword")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative mt-1.5">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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