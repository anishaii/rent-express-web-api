"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo_1.png";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useState, useEffect } from "react";


interface Category {
  _id: string;
  name: string;
}

  export default function Navbar() {
  const { isAuthenticated, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  // use fetch directly - no auth needed for public categories
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/category`;
      console.log("Fetching categories from:", url); // check this in browser console
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  fetchCategories();
}, []);

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-15 items-center justify-between px-6">

        {/* Logo */}
        <div>
          <Image src={logo} alt="RentExpress Logo" width={70} height={60} priority />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="font-medium transition-colors duration-200 hover:text-cyan-500">
            Home
          </Link>
          <Link href="/vehicles" className="font-medium transition-colors duration-200 hover:text-cyan-500">
            Vehicle
          </Link>
          <Link href="/bookings" className="font-medium transition-colors duration-200 hover:text-cyan-500">
            Booking
          </Link>

          {/* categories dropdown - fetched from API */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-cyan-500 outline-none">
              Categories <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem key={category._id} asChild>
                  <Link href={`/vehicles?category=${category.name}`}>
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/favourites" className="font-medium transition-colors duration-200 hover:text-cyan-500">
            Favourites
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