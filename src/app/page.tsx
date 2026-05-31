import Image from "next/image";
import logo from "@/app/assets/logo_1.png";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
  <div>
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-15 items-center justify-between px-6">
        
        {/* Logo */}
        <div>
          <Image
            src={logo}
            alt="RentExpress Logo"
            width={70}
            height={50}
            priority
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-10">
          <a href="#" className="font-medium transition-colors duration-200 hover:text-cyan-500"
          >Home
          </a>

          <a
            href="#"
            className="font-medium transition-colors duration-200 hover:text-cyan-500"
          >Vehicle</a>

          <a
            href="#"
            className="font-medium transition-colors duration-200 hover:text-cyan-500"
          >Booking</a>

          <a
            href="#"
            className="font-medium transition-colors duration-200 hover:text-cyan-500"
          >category</a>

           <a href="#"
            className="font-medium transition-colors duration-200 hover:text-cyan-500"
          >Favorite</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="secondary">Login</Button>
          <Button className="bg-cyan-500 hover:bg-cyan-600">
            Register
          </Button>
        </div>
      </div>
    </nav>
  </div>

   
  );
}