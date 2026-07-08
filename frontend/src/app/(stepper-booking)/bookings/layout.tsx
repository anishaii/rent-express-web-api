"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckIcon } from "lucide-react";
import logo from "@/app/assets/logo_1.png";
import UserMenu from "@/components/UserMenu";

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

  // determine current step index based on pathname
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path),
  );

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      {/* stepper navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 sm:px-14 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* logo */}
          <Link href="/" className="shrink-0">
            <Image src={logo} alt="RentExpress" width={55} height={60} />
          </Link>

          {/* stepper - hidden on small screens, shows compact "Step X of 3" instead */}
          <div className="hidden sm:flex items-center flex-1 justify-center max-w-xl mx-8">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className="flex items-center flex-1 last:flex-none"
                >
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

          {/* mobile step indicator */}
          <span className="sm:hidden text-xs font-semibold text-[#0092B8] shrink-0">
            Step {currentStepIndex + 1} of 3
          </span>

          {/* user menu - real dropdown with profile/admin/logout */}
          <div className="shrink-0">
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* page content */}
      <main>{children}</main>
    </div>
  );
}