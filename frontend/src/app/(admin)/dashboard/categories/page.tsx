import { handleGetAllCategories } from "@/lib/actions/admin/category-action";
import CategoryTable from "./_components/CategoryTable";



export default async function CategoriesPage() {
  const result = await handleGetAllCategories();

  if (!result.success) {
    throw new Error(result.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl  text-slate-600 font-medium  mb-6">Category Management</h1>
      <CategoryTable categories={result.data} />
    </div>
  );
}