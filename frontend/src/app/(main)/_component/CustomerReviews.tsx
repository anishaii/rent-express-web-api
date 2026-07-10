"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { StarIcon } from "lucide-react";

interface Customer {
  fullName: string;
  imageUrl?: string;
}

interface Vehicle {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  customerId: Customer;
  vehicleId: Vehicle;
}

interface CustomerReviewsProps {
  reviews: Review[];
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
  const router = useRouter();

  // hide the whole section if there are no reviews yet
  if (reviews.length === 0) return null;

  return (
    <section className="px-14 py-12 bg-gray-50">
      {/* section header */}
      <div className="text-center mb-10">
        <p className="text-xs font-bold text-[#0092B8] uppercase tracking-widest mb-2">
          Loved by Renters
        </p>
        <h2 className="text-2xl font-bold text-[#13303a]">
          What our customers say
        </h2>
      </div>

      {/* reviews grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            onClick={() => router.push(`/vehicles/${review.vehicleId._id}`)}
            className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all cursor-pointer"
          >
            {/* star rating */}
            <div className="flex items-center gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* review comment */}
            <p className="text-sm text-[#51636a] leading-relaxed mb-6">
              "{review.comment}"
            </p>

            {/* reviewer info */}
            <div className="flex items-center gap-3">
              {review.customerId.imageUrl ? (
                <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${review.customerId.imageUrl}`}
                    alt={review.customerId.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-9 w-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm shrink-0">
                  {review.customerId.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-[#13303a]">
                  {review.customerId.fullName}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}