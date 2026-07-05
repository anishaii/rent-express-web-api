"use client";

import Image from "next/image";
import logo from "@/app/assets/logo.png";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  CarIcon,
  TagIcon,
  CalendarIcon,
  UsersIcon,
  Award,
  StarIcon,
} from "lucide-react";

const sidebarItems = [
  { icon: <LayoutDashboardIcon className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
  { icon: <UsersIcon className="h-5 w-5" />, label: "Customers", path: "/dashboard/users" },
  { icon: <CarIcon className="h-5 w-5" />, label: "Vehicles", path: "/dashboard/vehicles" },
  { icon: <TagIcon className="h-5 w-5" />, label: "Categories", path: "/dashboard/categories" },
  { icon: <Award className="h-5 w-5" />, label: "Brands", path: "/dashboard/brands" },
  { icon: <CalendarIcon className="h-5 w-5" />, label: "Bookings", path: "/dashboard/bookings" },
  { icon: <StarIcon className="h-5 w-5" />, label: "Reviews", path: "/dashboard/reviews" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0F172A] text-white flex flex-col">
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-6 py-5 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src={logo}
          alt="Rent Express logo"
          height={32}
          width={32}
          className="rounded-lg"
        />
        <span className="text-xl font-semibold">Rent Express</span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 px-3 mt-2">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => router.push(item.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${pathname === item.path
                ? "bg-cyan-400 text-white"
                : "text-gray-300 hover:bg-white/10"
              }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}