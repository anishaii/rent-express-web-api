"use client";

import { useState } from "react";
import Image from "next/image";
import heroImage from "@/app/assets/hero_image.jpg"; // adjust filename to match yours
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const categories = ["Bike", "Scooter", "Car", "Luxury Car", "Jeep", "Recreational Vehicle"];

export default function HeroSection() {
  const { user } = useAuth();

  const [pickupOpen, setPickupOpen] = useState(false);
  const [dropoffOpen, setDropoffOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<string>("");

  const handleSearch = () => {
    // search logic will be wired once vehicle listing page exists
    console.log({ pickupDate, dropoffDate, category });
  };

  return (
    <div className="relative h-120 w-full">
      {/* Background image */}
      <Image src={heroImage} alt="Vehicles" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-start pt-10 px-4 text-center text-white">
        <p className="text-2xl font-medium mb-2">
          Welcome to Rent Express<span className="font-medium">{user?.fullName?.split(" ")[0]}</span>
        </p>
        <p className="text-slate-900 mb-8">Choose from our wide selection of vehicles for every journey</p>

        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-end w-full max-w-3xl text-gray-900">
          {/* Pick-up Date */}
          <div className="flex-1 text-left">
            <label className="text-sm font-medium block mb-1">Pick-up Date</label>
            <Popover open={pickupOpen} onOpenChange={setPickupOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-normal">
                  <span className="flex items-center text-gray-500">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? pickupDate.toLocaleDateString() : "mm/dd/yy"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pickupDate}
                  onSelect={(date) => {
                    setPickupDate(date);
                    setPickupOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Drop-off Date */}
          <div className="flex-1 text-left">
            <label className="text-sm font-medium block mb-1">Drop-off Date</label>
            <Popover open={dropoffOpen} onOpenChange={setDropoffOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-normal">
                  <span className="flex items-center text-gray-500">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dropoffDate ? dropoffDate.toLocaleDateString() : "mm/dd/yy"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dropoffDate}
                  onSelect={(date) => {
                    setDropoffDate(date);
                    setDropoffOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category */}
          <div className="flex-1 text-left">
            <label className="text-sm font-medium block mb-1">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-cyan-500 hover:bg-cyan-600 h-9 px-6 flex items-center gap-2"
          >
            <SearchIcon className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}