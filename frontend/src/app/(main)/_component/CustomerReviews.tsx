"use client";

import { StarIcon } from "lucide-react";

// dummy reviews - will be replaced with real API data when vehicle detail page is built
const dummyReviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    location: "Kathmandu",
    rating: 5,
    comment:
      "Booking was effortless and the SUV was spotless. Pickup took five minutes — will rent again for sure.",
  },
  {
    id: 2,
    name: "Sneha Gurung",
    location: "Pokhara",
    rating: 5,
    comment:
      "Great prices and friendly support. They helped me extend my trip with one quick call.",
  },
  {
    id: 3,
    name: "Bikash Thapa",
    location: "Lalitpur",
    rating: 5,
    comment:
      "Wide choice of vehicles and no hidden charges. The electric vehicle was perfect for the city.",
  },
];

export default function CustomerReviews() {
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
        {dummyReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all"
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
              <div className="h-9 w-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm shrink-0">
                {review.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#13303a]">
                  {review.name}
                </p>
                <p className="text-xs text-[#8093a0]">{review.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}