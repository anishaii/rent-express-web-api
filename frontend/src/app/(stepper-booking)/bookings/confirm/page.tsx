import { Suspense } from "react";
import ConfirmBookingForm from "./ConfirmBookingForm";

export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmBookingForm />
    </Suspense>
  );
}