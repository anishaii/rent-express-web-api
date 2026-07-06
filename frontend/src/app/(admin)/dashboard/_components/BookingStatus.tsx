"use client";

import { ClockIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

interface BookingStatusProps {
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export default function BookingStatus({
  pendingBookings,
  confirmedBookings,
  completedBookings,
  cancelledBookings,
}: BookingStatusProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* pending bookings */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center gap-3">
        <ClockIcon className="h-8 w-8 text-yellow-500 shrink-0" />
        <div>
          <p className="text-xl font-bold text-yellow-700">{pendingBookings}</p>
          <p className="text-xs text-yellow-600">Pending</p>
        </div>
      </div>

      {/* confirmed bookings */}
      <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 flex items-center gap-3">
        <CalendarIcon className="h-8 w-8 text-cyan-500 flex-0" />
        <div>
          <p className="text-xl font-bold text-cyan-700">{confirmedBookings}</p>
          <p className="text-xs text-cyan-600">Confirmed</p>
        </div>
      </div>

      {/* completed bookings */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
        <CheckCircleIcon className="h-8 w-8 text-green-500 flex-0" />
        <div>
          <p className="text-xl font-bold text-green-700">{completedBookings}</p>
          <p className="text-xs text-green-600">Completed</p>
        </div>
      </div>

      {/* cancelled bookings */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
        <XCircleIcon className="h-8 w-8 text-red-400 flex-0" />
        <div>
          <p className="text-xl font-bold text-red-600">{cancelledBookings}</p>
          <p className="text-xs text-red-500">Cancelled</p>
        </div>
      </div>
    </div>
  );
}