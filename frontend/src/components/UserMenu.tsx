"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import {
  UserIcon,
  CreditCardIcon,
  LogOutIcon,
  ShieldUser,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { logout, user } = useAuth();
  const router = useRouter();

  // build full image url from backend, fallback to undefined if no image set
  const avatarSrc = user?.imageUrl
    ? `${process.env.NEXT_PUBLIC_BASE_URL}${user.imageUrl}`
    : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2">
          <Avatar>
            <AvatarImage src={avatarSrc} alt="User" />
            <AvatarFallback className="text-xs">
              {user?.fullName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user?.fullName}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          {/* Profile - navigates to update profile page */}
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => router.push("/profile")}
          >
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>

          {/* Admin only */}
          {user?.role === "admin" && (
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => router.push("/dashboard")}
            >
              <ShieldUser className="h-4 w-4" />
              <span>Admin</span>
            </DropdownMenuItem>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to login again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={logout} className="bg-red-600 hover:bg-red-800 text-white">
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}