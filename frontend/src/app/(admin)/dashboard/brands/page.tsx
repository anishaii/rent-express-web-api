import { handleGetAllBrands } from "@/lib/actions/admin/brand-action";
import BrandTable from "./_components/BrandTable";


export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const { page: pageParam, limit: limitParam, search: searchParam } = await searchParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const limit = limitParam ? parseInt(limitParam) : 10;
  const search = searchParam || "";

  const result = await handleGetAllBrands({ page, limit, search });

  if (!result.success) {
    throw new Error(result.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl  text-slate-600 font-medium  mb-6">Brand Management</h1>
      <BrandTable
        brands={result.data}
        pagination={result.pagination}
        search={search}
      />
    </div>
  );
}