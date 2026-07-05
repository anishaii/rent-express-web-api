import { handleGetAllBookings } from "@/lib/actions/admin/booking-action";
import BookingTable from "./_components/BookingTable";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  }>;
}) {
  const {
    page: pageParam,
    limit: limitParam,
    search: searchParam,
    status: statusParam,
  } = await searchParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const limit = limitParam ? parseInt(limitParam) : 10;
  const search = searchParam || "";
  const status = statusParam || "all";

  const result = await handleGetAllBookings({ page, limit, search, status });

  if (!result.success) {
    throw new Error(result.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl text-slate-600 font-medium mb-6">
        Booking Management
      </h1>
      <BookingTable
        bookings={result.data}
        pagination={result.pagination}
        search={search}
        currentStatus={status}
      />
    </div>
  );
}