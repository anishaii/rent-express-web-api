"use client";

import { useState, useEffect, useCallback } from "react";
import { handleGetMyBookings } from "@/lib/actions/public/booking-action";
import BookingCard from "./_components/BookingCard";

type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const tabs: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");

  const fetchBookings = useCallback(async () => {
    const result = await handleGetMyBookings();
    if (result.success) {
      setBookings(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="px-6 sm:px-14 py-10">
      <h1 className="text-2xl font-bold text-[#13303a] mb-6">My Bookings</h1>

      {/* status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.value
                ? "bg-[#0092B8] text-white"
                : "bg-white border border-gray-200 text-[#51636a] hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* bookings list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8093a0] text-sm">
            No bookings found in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancelled={fetchBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
}