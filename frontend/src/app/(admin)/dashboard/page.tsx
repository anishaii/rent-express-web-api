"use client";
import UserMenu from "@/components/UserMenu";
import AdminSidebar from "@/components/AdminSidebar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-end px-6 border-b bg-white">
          <UserMenu />
        </header>
        <main className="flex-1 bg-gray-50 p-6">
          {/* dashboard content goes here */}
        </main>
      </div>
    </div>
  );
}