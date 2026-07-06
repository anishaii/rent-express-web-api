"use client";

import Link from "next/link";
import {
  CarIcon,
  CalendarIcon,
  UsersIcon,
  StarIcon,
  TagIcon,
  Award,
} from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="flex items-center gap-3 flex-wrap">
        {/* add vehicle */}
        <Link
          href="/dashboard/vehicles/new"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <CarIcon className="h-4 w-4" />
          Add Vehicle
        </Link>

        {/* view bookings */}
        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          <CalendarIcon className="h-4 w-4" />
          View Bookings
        </Link>

        {/* view customers */}
        <Link
          href="/dashboard/users"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          <UsersIcon className="h-4 w-4" />
          View Customers
        </Link>

        {/* view reviews */}
        <Link
          href="/dashboard/reviews"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          <StarIcon className="h-4 w-4" />
          View Reviews
        </Link>

        {/* manage categories */}
        <Link
          href="/dashboard/categories"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          <TagIcon className="h-4 w-4" />
          Categories
        </Link>

        {/* manage brands */}
        <Link
          href="/dashboard/brands"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          <Award className="h-4 w-4" />
          Brands
        </Link>
      </div>
    </div>
  );
}