import { Suspense } from "react";
import ReviewBookingForm from "./ReviewBookingForm";

export default function ReviewBookingPage() {
  return (
    <Suspense fallback={null}>
      <ReviewBookingForm />
    </Suspense>
  );
}