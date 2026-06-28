import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "./_components/UserTable";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const { page: pageParam, limit: limitParam, search: searchParam } = await searchParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const limit = limitParam ? parseInt(limitParam) : 10;
  const search = searchParam || "";

  const result = await handleGetAllUsers({ page, limit, search });

  if (!result.success) {
    throw new Error(result.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Customer Management</h1>
      <UserTable
        users={result.data}
        pagination={result.pagination}
        search={search}
      />
    </div>
  );
}