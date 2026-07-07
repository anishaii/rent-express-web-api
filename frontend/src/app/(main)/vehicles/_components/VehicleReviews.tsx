"use client";

import { useEffect, useState } from "react";
import { StarIcon, UserIcon } from "lucide-react";

interface Customer {
  _id: string;
  fullName: string;
  imageUrl?: string;
}

interface Review {
  _id: string;
  customerId: Customer;
  rating: number;
  comment: string;
  createdAt: string;
}

interface VehicleReviewsProps {
  vehicleId: string;
}

// render star rating
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default function VehicleReviews({ vehicleId }: VehicleReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch reviews for this vehicle from public API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/review/vehicle/${vehicleId}`,
        );
        const data = await response.json();
        if (data.success) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [vehicleId]);

  // calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-[#13303a]">
          Customer Reviews
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-sm font-semibold text-[#13303a]">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-[#8093a0]">
              ({reviews.length} reviews)
            </span>
          </div>
        )}
      </div>

      {/* loading state */}
      {loading && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-full bg-gray-200" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* empty state */}
      {!loading && reviews.length === 0 && (
        <div className="text-center py-8">
          <StarIcon className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-400">No reviews yet</p>
          <p className="text-xs text-gray-300 mt-1">
            Be the first to review this vehicle
          </p>
        </div>
      )}

      {/* reviews list */}
      {!loading && reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex gap-3 pb-5 border-b border-gray-50 last:border-0 last:pb-0"
            >
              {/* customer avatar */}
              <div className="h-9 w-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold text-sm shrink-0">
                {review.customerId?.fullName?.charAt(0).toUpperCase() || (
                  <UserIcon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-[#13303a]">
                    {review.customerId?.fullName || "Anonymous"}
                  </p>
                  <span className="text-xs text-[#8093a0]">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StarRating rating={review.rating} />
                <p className="text-sm text-[#51636a] mt-2 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}