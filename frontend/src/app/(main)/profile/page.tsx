import { handleUserDetails } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import ProfileForm from "./_components/ProfileForm";
import PasswordForm from "./_components/PasswordForm";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await handleUserDetails(); // loading.tsx shows automatically while this resolves
  if (!user.success) {
    throw new Error(user.message); // triggers error.tsx
  }
  if (!user.data) {
    notFound(); // triggers not-found.tsx
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <ProfileForm user={user.data} />
        <PasswordForm/>
      </div>
    </div>
  );
}