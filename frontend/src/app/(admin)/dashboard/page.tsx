import {
  CarIcon,
  CalendarIcon,
  UsersIcon,
  DollarSignIcon,
  StarIcon,
  TagIcon,
} from "lucide-react";
import { handleGetDashboardStats } from "@/lib/actions/admin/dashboard-action";
import StatCard from "./_components/StatCard";
import BookingStatus from "./_components/BookingStatus";
import RecentBookings from "./_components/RecentBookings";
import RecentCustomers from "./_components/RecentCustomers";
import QuickActions from "./_components/QuickActions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await handleGetDashboardStats();

  if (!result.success) {
    throw new Error(result.message);
  }

  const stats = result.data;

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div>
        <h1 className="text-xl text-slate-600 font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back, Admin</p>
      </div>

      {/* top stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon={<CarIcon className="h-5 w-5 text-white" />}
          iconBgColor="bg-cyan-500"
          badge={`${stats.availableVehicles} available`}
          badgeColor="text-green-600 bg-green-50"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<CalendarIcon className="h-5 w-5 text-white" />}
          iconBgColor="bg-violet-500"
          badge={`${stats.pendingBookings} pending`}
          badgeColor="text-yellow-600 bg-yellow-50"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<UsersIcon className="h-5 w-5 text-white" />}
          iconBgColor="bg-orange-500"
          badge={`${stats.totalBrands} brands`}
          badgeColor="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Total Revenue"
          value={`NPR ${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSignIcon className="h-5 w-5 text-white" />}
          iconBgColor="bg-green-500"
          badge="completed"
          badgeColor="text-green-600 bg-green-50"
        />
      </div>

      {/* booking status row */}
      <BookingStatus
        pendingBookings={stats.pendingBookings}
        confirmedBookings={stats.confirmedBookings}
        completedBookings={stats.completedBookings}
        cancelledBookings={stats.cancelledBookings}
      />

      {/* recent bookings + recent customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentBookings bookings={stats.recentBookings} />
        <RecentCustomers customers={stats.recentCustomers} />
      </div>

      {/* quick actions */}
      <QuickActions />
    </div>
  );
}