"use client";

import { useEffect, useState } from "react";
import { StarIcon, UserIcon } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";

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

// display only star rating
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

// interactive star rating for review form
const InteractiveStarRating = ({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (rating: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <StarIcon
            className={`h-6 w-6 transition-colors ${
              star <= (hovered || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function VehicleReviews({ vehicleId }: VehicleReviewsProps) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

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
          // check if logged in user already reviewed this vehicle
          if (user && data.data.length > 0) {
            const userReview = data.data.find(
              (r: Review) => r.customerId?._id === user._id,
            );
            if (userReview) setAlreadyReviewed(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [vehicleId, user]);

  // submit review with auth token from cookie
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating", { duration: 1500 });
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment", { duration: 1500 });
      return;
    }

    setSubmitting(true);
    try {
      // get token from cookie for authorization
      const { getTokenCookie } = await import("@/lib/cookies");
      const token = await getTokenCookie();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/review/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vehicleId, rating, comment }),
        },
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Review submitted successfully!", { duration: 1500 });
        
        // manually add customer info since backend returns unpopulated review
        const newReview = {
          ...data.data,
          customerId: {
            _id: user._id,
            fullName: user.fullName,
          },
        };
        setAlreadyReviewed(true);
        setRating(0);
        setComment("");
      } else {
        toast.error(data.message || "Failed to submit review", {
          duration: 1500,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", { duration: 1500 });
    } finally {
      setSubmitting(false);
    }
  };

  // calculate average rating from all reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      {/* header with average rating */}
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

      {/* loading skeleton */}
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
        <div className="space-y-5 mb-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex gap-3 pb-5 border-b border-gray-50 last:border-0 last:pb-0"
            >
              {/* customer avatar */}
              <div className="h-9 w-9 rounded-full overflow-hidden bg-cyan-100 shrink-0">
              {review.customerId?.imageUrl ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${review.customerId.imageUrl}`}
                  alt={review.customerId.fullName}
                  className="h-full w-full object-cover"
                />
                ) : (
                <div className="h-full w-full flex items-center justify-center text-cyan-600 font-semibold text-sm">
                  {review.customerId?.fullName?.charAt(0).toUpperCase()}
                </div>
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

      {/* review form section */}
      <div className="border-t border-gray-100 pt-6">
        {/* not logged in */}
        {!isAuthenticated && (
          <div className="text-center py-4">
            <p className="text-sm text-[#51636a] mb-3">
              Login to write a review
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#0092B8] hover:bg-[#007a99] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Login to Review
            </Link>
          </div>
        )}

        {/* admin cannot review */}
        {isAuthenticated && user?.role === "admin" && (
          <p className="text-sm text-center text-[#8093a0]">
            Admin accounts cannot write reviews.
          </p>
        )}

        {/* user already reviewed */}
        {isAuthenticated && user?.role === "user" && alreadyReviewed && (
          <div className="text-center py-4 bg-green-50 rounded-xl">
            <p className="text-sm text-green-600 font-medium">
              ✓ You have already reviewed this vehicle
            </p>
          </div>
        )}

        {/* review form for logged in user who hasn't reviewed yet */}
        {isAuthenticated && user?.role === "user" && !alreadyReviewed && (
          <div>
            <h3 className="text-sm font-bold text-[#13303a] mb-4">
              Write a Review
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* interactive star rating */}
              <div>
                <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-2 block">
                  Your Rating
                </label>
                <InteractiveStarRating rating={rating} onRate={setRating} />
              </div>

              {/* comment textarea */}
              <div>
                <label className="text-xs font-semibold text-[#8093a0] uppercase tracking-widest mb-2 block">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your experience with this vehicle..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none text-[#13303a] placeholder:text-gray-400"
                />
              </div>

              {/* submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#0092B8] hover:bg-[#007a99] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}