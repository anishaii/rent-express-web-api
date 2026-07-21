import { handleGetAllVehicles } from "@/lib/actions/admin/vehicle-action";
import VehicleTable from "./_components/VehicleTable";

export const dynamic = "force-dynamic";

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const { page: pageParam, limit: limitParam, search: searchParam } =
    await searchParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const limit = limitParam ? parseInt(limitParam) : 10;
  const search = searchParam || "";

  const result = await handleGetAllVehicles({ page, limit, search });

  if (!result.success) {
    throw new Error(result.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl text-slate-600 font-medium mb-6">
        Vehicle Management
      </h1>
      <VehicleTable
        vehicles={result.data}
        pagination={result.pagination}
        search={search}
      />
    </div>
  );
}