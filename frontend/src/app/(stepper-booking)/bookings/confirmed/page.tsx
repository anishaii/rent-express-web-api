import { Suspense } from "react";
import ConfirmedBookingForm from "./ConfirmedBookingForm";

export default function ConfirmedBookingPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmedBookingForm />
    </Suspense>
  );
}