"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/app/assets/logo_1.png";
import { useAuth } from "@/lib/context/AuthContext";
import { CheckIcon } from "lucide-react";

const steps = [
  { id: "confirm", label: "Confirm Booking", path: "/bookings/confirm" },
  { id: "review", label: "Review Booking", path: "/bookings/review" },
  { id: "confirmed", label: "Confirmed", path: "/bookings/confirmed" },
];

export default function BookingStepperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  // determine current step index based on pathname
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path),
  );

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      {/* stepper navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 sm:px-14 py-4">
        <div className="flex items-center justify-between">
          {/* logo */}
          <Link href="/" className="shrink-0">
            <Image src={logo} alt="RentExpress" width={50} height={45} />
          </Link>

          {/* stepper */}
          <div className="hidden sm:flex items-center flex-1 justify-center max-w-xl mx-8">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  {/* step circle */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-[#0092B8] text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        isActive ? "text-[#13303a]" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-3 mb-5 transition-colors ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* user avatar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold text-sm">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400">Welcome back!</p>
              <p className="text-sm font-medium text-[#13303a]">
                {user?.fullName || "User"}
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* page content */}
      <main>{children}</main>
    </div>
  );
}