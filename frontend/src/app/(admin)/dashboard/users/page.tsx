import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "./_components/UserTable";

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const search = searchParams.search || "";

  const result = await handleGetAllUsers({ page, limit, search });

  if (!result.success) {
    throw new Error(result.message); // triggers error.tsx
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