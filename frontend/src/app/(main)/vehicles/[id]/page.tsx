import { handleGetPublicVehicleById } from "@/lib/actions/public/vehicle-action";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  UsersIcon,
  FuelIcon,
  ZapIcon,
  CalendarIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "lucide-react";
import BookingForm from "../_components/BookingForm";
import VehicleReviews from "../_components/VehicleReviews";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await handleGetPublicVehicleById(id);

  if (!result.success) {
    throw new Error(result.message);
  }

  if (!result.data) {
    notFound();
  }

  const vehicle = result.data;

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
            <BreadcrumbLink href="/vehicles">Vehicles</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{vehicle.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* left column - vehicle details */}
        <div className="lg:col-span-2 space-y-6">

          {/* vehicle image */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100">
            {vehicle.imageUrl ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${vehicle.imageUrl}`}
                alt={vehicle.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-bold text-6xl">
                {vehicle.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* availability badge */}
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                vehicle.isAvailable
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}>
                {vehicle.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            {/* category badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-[#0092B8] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {vehicle.categoryId?.name}
              </span>
            </div>
          </div>

          {/* vehicle header */}
          <div>
            <p className="text-sm text-[#0092B8] font-semibold mb-1">
              {vehicle.brandId?.name}
            </p>
            <h1 className="text-3xl font-bold text-[#13303a] mb-2">
              {vehicle.name}
            </h1>
            <p className="text-[#51636a] leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* specs grid */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="text-base font-bold text-[#13303a] mb-4">
              Vehicle Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                  <UsersIcon className="h-4 w-4 text-[#0092B8]" />
                </div>
                <div>
                  <p className="text-xs text-[#8093a0]">Seats</p>
                  <p className="text-sm font-semibold text-[#13303a]">
                    {vehicle.seats} seats
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                  <FuelIcon className="h-4 w-4 text-[#0092B8]" />
                </div>
                <div>
                  <p className="text-xs text-[#8093a0]">Fuel Type</p>
                  <p className="text-sm font-semibold text-[#13303a]">
                    {vehicle.fuelType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                  <ZapIcon className="h-4 w-4 text-[#0092B8]" />
                </div>
                <div>
                  <p className="text-xs text-[#8093a0]">Transmission</p>
                  <p className="text-sm font-semibold text-[#13303a]">
                    {vehicle.transmission}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                  <CalendarIcon className="h-4 w-4 text-[#0092B8]" />
                </div>
                <div>
                  <p className="text-xs text-[#8093a0]">Category</p>
                  <p className="text-sm font-semibold text-[#13303a]">
                    {vehicle.categoryId?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPinIcon className="h-4 w-4 text-[#0092B8]" />
                </div>
                <div>
                  <p className="text-xs text-[#8093a0]">Pickup</p>
                  <p className="text-sm font-semibold text-[#13303a]">
                    Kathmandu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="h-9 w-9 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheckIcon className="h-4 w-4 text-[#0092B8]" />
                </div>
                <div>
                  <p className="text-xs text-[#8093a0]">Brand</p>
                  <p className="text-sm font-semibold text-[#13303a]">
                    {vehicle.brandId?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* reviews section */}
          <VehicleReviews vehicleId={vehicle._id} />
        </div>

        {/* right column - booking form */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {/* price card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4 shadow-sm">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-[#13303a]">
                  NPR {vehicle.pricePerDay.toLocaleString()}
                </span>
                <span className="text-sm text-[#8093a0]">/ day</span>
              </div>
              <p className="text-xs text-[#8093a0] mb-6">
                Inclusive of all taxes and fees
              </p>

              {/* booking form */}
              <BookingForm
                vehicleId={vehicle._id}
                isAvailable={vehicle.isAvailable}
              />
            </div>

            {/* pickup info */}
            <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-[#0092B8] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#13303a]">
                    Pickup Location
                  </p>
                  <p className="text-xs text-[#51636a] mt-1">
                    New Baneshwor, Kathmandu, Nepal
                  </p>
                  <p className="text-xs text-[#8093a0] mt-1">
                    Mon - Sat: 8:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}