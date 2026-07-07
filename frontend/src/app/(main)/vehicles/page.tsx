import { handleGetPublicVehicles } from "@/lib/actions/public/vehicle-action";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";
import VehiclesClient from "./_components/VehiclesClient";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function VehiclesPage() {
  // fetch vehicles and categories in parallel
  const [vehiclesResult, categoriesResult] = await Promise.all([
    handleGetPublicVehicles(),
    handleGetPublicCategories(),
  ]);

  const vehicles = vehiclesResult.success ? vehiclesResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="px-14 py-8">
      {/* breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Vehicles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <VehiclesClient vehicles={vehicles} categories={categories} />
    </div>
  );
}