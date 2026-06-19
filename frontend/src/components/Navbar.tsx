"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo_1.png";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function Navbar() {
  const {isAuthenticated, loading} = useAuth();
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-15 items-center justify-between px-6">

        {/* Logo */}
        <div>
          <Image src={logo} alt="RentExpress Logo" width={70} height={60} priority />
        </div>
          {/* <div className="flex items-center">
          <Image src={logo} alt="RentExpress Logo" width={70} height={60} priority />

          <h5>Rent<span className="text-cyan-700">Express</span></h5>
          </div> */}

        {/* Navigation Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="font-medium transition-colors duration-200 hover:text-cyan-500">
            Home
          </Link>
          <Link href="/vehicles" className="font-medium transition-colors duration-200 hover:text-cyan-500">
            Vehicle
          </Link>
          <Link href="/booking" className="font-medium transition-colors duration-200 hover:text-cyan-500">
            Booking
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-cyan-500 outline-none">
              Categories <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/category/car">Cars</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/category/bike">Bikes</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/favorites" className="font-medium transition-colors duration-200 hover:text-cyan-500">
            Favorite
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {!loading && !isAuthenticated && (
            <>
              <Button variant="secondary" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
          {!loading && isAuthenticated && <UserMenu />}
        </div>
      </div>
    </nav>
  );
}