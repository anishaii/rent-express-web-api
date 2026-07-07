import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo_1.png";
import { MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-300 px-14 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src={logo} alt="RentExpress" width={40} height={40} />
            <span className="text-white font-bold text-lg">RentExpress</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Nepal's friendly way to rent a vehicle. Wide fleet, fair daily rates, and support whenever you need it.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-cyan-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/vehicles" className="hover:text-cyan-400 transition-colors">
                Vehicles
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-cyan-400 transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-cyan-400 transition-colors">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
            Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/vehicles?category=Bike" className="hover:text-cyan-400 transition-colors">Bike</Link></li>
            <li><Link href="/vehicles?category=Scooter" className="hover:text-cyan-400 transition-colors">Scooter</Link></li>
            <li><Link href="/vehicles?category=Car" className="hover:text-cyan-400 transition-colors">Car</Link></li>
            <li><Link href="/vehicles?category=Van" className="hover:text-cyan-400 transition-colors">Van</Link></li>
            <li><Link href="/vehicles?category=Pickup Truck" className="hover:text-cyan-400 transition-colors">Pickup Truck</Link></li>
            <li><Link href="/vehicles?category=Luxury Car" className="hover:text-cyan-400 transition-colors">Luxury Car</Link></li>
            <li><Link href="/vehicles?category=Electric Vehicle" className="hover:text-cyan-400 transition-colors">Electric Vehicle</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
            Get in Touch
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPinIcon className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>New Baneshwor, Kathmandu, Nepal</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>+977-1-4567890</span>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>support@rentexpress.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© 2026 RentExpress. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-cyan-400 transition-colors">Terms</Link>
          <Link href="#" className="hover:text-cyan-400 transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}