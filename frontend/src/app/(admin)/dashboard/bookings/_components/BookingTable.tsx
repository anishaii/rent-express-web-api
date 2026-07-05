"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
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
  handleConfirmBooking,
  handleCompleteBooking,
  handleCancelBooking,
} from "@/lib/actions/admin/booking-action";

interface Customer {
  _id: string;
  fullName: string;
  email: string;
}

interface Vehicle {
  _id: string;
  name: string;
}

interface Booking {
  _id: string;
  bookingId: string;
  customerId: Customer;
  vehicleId: Vehicle;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BookingTableProps {
  bookings: Booking[];
  pagination: Pagination;
  search: string;
  currentStatus: string;
}

// status filter tabs
const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled"];

// status badge colors
const getStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-cyan-100 text-cyan-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function BookingTable({
  bookings,
  pagination,
  search,
  currentStatus,
}: BookingTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search);
  const [isPending, startTransition] = useTransition();

  // handle search - wraps router.push in transition so it doesn't block UI
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    startTransition(() => {
      router.push(
        `/dashboard/bookings?page=1&search=${value}&status=${currentStatus}`,
      );
    });
  };

  // handle status filter tab click
  const handleStatusFilter = (status: string) => {
    router.push(
      `/dashboard/bookings?page=1&search=${searchTerm}&status=${status}`,
    );
  };

  // handle page change
  const handlePageChange = (newPage: number) => {
    router.push(
      `/dashboard/bookings?page=${newPage}&search=${searchTerm}&status=${currentStatus}`,
    );
  };

  // handle confirm booking
  const handleConfirm = async (id: string) => {
    const result = await handleConfirmBooking(id);
    if (result.success) {
      toast.success("Booking confirmed successfully", { duration: 1500 });
      router.refresh();
    } else {
      toast.error(result.message || "Failed to confirm booking", {
        duration: 1500,
      });
    }
  };

  // handle complete booking
  const handleComplete = async (id: string) => {
    const result = await handleCompleteBooking(id);
    if (result.success) {
      toast.success("Booking completed successfully", { duration: 1500 });
      router.refresh();
    } else {
      toast.error(result.message || "Failed to complete booking", {
        duration: 1500,
      });
    }
  };

  // handle cancel booking
  const handleCancel = async (id: string) => {
    const result = await handleCancelBooking(id);
    if (result.success) {
      toast.success("Booking cancelled successfully", { duration: 1500 });
      router.refresh();
    } else {
      toast.error(result.message || "Failed to cancel booking", {
        duration: 1500,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleStatusFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              currentStatus === tab
                ? "bg-cyan-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div
        className={`flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 mb-6 ${
          isPending ? "opacity-60" : ""
        }`}
      >
        <SearchIcon className="h-4 w-4 text-gray-400 flex-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by ID, customer, or vehicle..."
          className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No bookings found.
        </div>
      ) : (
        <>
          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Booking ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Vehicle
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Pick-up
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Drop-off
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Total Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  {/* booking id */}
                  <td className="py-4 px-4 text-sm font-medium text-cyan-600">
                    {booking.bookingId}
                  </td>
                  {/* customer name */}
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {booking.customerId?.fullName || "—"}
                  </td>
                  {/* vehicle name */}
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {booking.vehicleId?.name || "—"}
                  </td>
                  {/* start date */}
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </td>
                  {/* end date */}
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  {/* total price */}
                  <td className="py-4 px-4 text-sm font-medium text-gray-800">
                    NPR {booking.totalPrice.toLocaleString()}
                  </td>
                  {/* status badge */}
                  <td className="py-4 px-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getStatusStyles(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  {/* actions based on status */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {/* view booking detail */}
                      <button
                        onClick={() =>
                          router.push(`/dashboard/bookings/${booking._id}`)
                        }
                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                      >
                        View
                      </button>

                      {/* confirm button - only for pending */}
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          className="px-3 py-1 text-xs bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
                        >
                          Confirm
                        </button>
                      )}

                      {/* complete button - only for confirmed */}
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => handleComplete(booking._id)}
                          className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg"
                        >
                          Complete
                        </button>
                      )}

                      {/* cancel button - for pending and confirmed */}
                      {(booking.status === "pending" ||
                        booking.status === "confirmed") && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg">
                              Cancel
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel this booking?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will cancel booking{" "}
                                <strong>{booking.bookingId}</strong> for{" "}
                                <strong>
                                  {booking.customerId?.fullName}
                                </strong>
                                . This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Back</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancel(booking._id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Cancel Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total,
                )}{" "}
                of {pagination.total} bookings
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1.5 text-sm border rounded-lg ${
                      pagination.page === i + 1
                        ? "bg-cyan-500 text-white border-cyan-500"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}