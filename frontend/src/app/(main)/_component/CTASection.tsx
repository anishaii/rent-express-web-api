"use client";

import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="px-14 py-12">
      <div className="bg-[#0092B8] rounded-2xl px-10 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* text */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to hit the road?
          </h2>
          <p className="text-[#d0f0f7] text-sm">
            Find your vehicle and book in minutes — same day pickup available in Kathmandu.
          </p>
        </div>

        {/* button */}
        <button
          onClick={() => router.push("/vehicles")}
          className="bg-white text-[#0092B8] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shrink-0"
        >
          Browse Vehicles
        </button>
      </div>
    </section>
  );
}