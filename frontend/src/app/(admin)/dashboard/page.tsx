import Image from "next/image";
import logo from "@/app/assets/logo.png";


export default function Navbar() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5">
          <Image
            src={logo}
            alt="Rent Express logo"
            height={32}
            width={32}
            className="rounded-lg"
          />
          <span className="text-xl font-semibold">Rent Express</span>
        </div>
        {/* sidebar nav items go here */}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-end px-6 border-b bg-white">
          
        </header>

        {/* Page content */}
        <main className="flex-1 bg-gray-50" />
      </div>
    </div>
  );
}