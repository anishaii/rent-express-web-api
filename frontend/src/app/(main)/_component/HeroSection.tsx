"use client";

import { useState } from "react";
import Image from "next/image";
import heroImage from "@/app/assets/hero_image.jpg";
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
import { CalendarIcon, SearchIcon, MapPinIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// categories come from parent page via API - not hardcoded
interface HeroSectionProps {
  categories: { _id: string; name: string }[];
}

export default function HeroSection({ categories }: HeroSectionProps) {
  const [pickupOpen, setPickupOpen] = useState(false);
  const [dropoffOpen, setDropoffOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<string>("");
  const router = useRouter();


  const handleSearch = () => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  router.push(`/vehicles${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start px-14 py-8 bg-linear-to-b from-[#f3fafc] to-white">

      {/* Left side */}
      <div className="flex flex-col gap-6">
        {/* Badge */}
        <div className="w-fit">
          <span className="bg-[#e2f2f7] text-[#007a99] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0092B8] inline-block" />
            500+ vehicles ready to drive
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[#13303a] leading-tight tracking-tight">
          Rent the right ride for{" "}
          <span className="text-[#0092B8]">every journey</span>
        </h1>

        {/* Subtext */}
        <p className="text-[#51636a] text-base max-w-md leading-relaxed">
          From city hatchbacks to 12 seater vans book in minutes, pick up the same day, and drive worry free across Nepal.
        </p>

        {/* Search Card */}
        <div className="bg-white border border-[#e7eef0] rounded-2xl shadow-sm p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#8093a0]">
                Pick-up Location
              </label>
              <div className="flex items-center gap-2 border border-[#e3ebee] rounded-xl px-3 py-3">
                <MapPinIcon className="h-4 w-4 text-[#0092B8]" strokeWidth={2} />
                <input
                  defaultValue="Kathmandu"
                  className="outline-none text-sm text-[#13303a] w-full bg-transparent"
                />
              </div>
            </div>

            {/* Category - comes from API */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#8093a0]">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-[#e3ebee] rounded-xl text-sm text-[#8093a0]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pick-up Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#8093a0]">
                Pick-up Date
              </label>
              <Popover open={pickupOpen} onOpenChange={setPickupOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 border border-[#e3ebee] rounded-xl px-3 py-3 text-sm text-[#8093a0] bg-white text-left">
                    <CalendarIcon className="h-4 w-4 text-[#0092B8]" strokeWidth={2} />
                    {pickupDate ? pickupDate.toLocaleDateString() : "mm / dd / yy"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={(date) => { setPickupDate(date); setPickupOpen(false); }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Drop-off Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#8093a0]">
                Drop-off Date
              </label>
              <Popover open={dropoffOpen} onOpenChange={setDropoffOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 border border-[#e3ebee] rounded-xl px-3 py-3 text-sm text-[#8093a0] bg-white text-left">
                    <CalendarIcon className="h-4 w-4 text-[#0092B8]" strokeWidth={2} />
                    {dropoffDate ? dropoffDate.toLocaleDateString() : "mm / dd / yy"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dropoffDate}
                    onSelect={(date) => { setDropoffDate(date); setDropoffOpen(false); }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full bg-[#0092B8] hover:bg-[#007a99] text-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <SearchIcon className="h-4 w-4" strokeWidth={2} />
            Search available vehicles
          </Button>
        </div>
      </div>

      {/* Right side - hero image */}
      <div className="hidden md:block h-113 rounded-2xl overflow-hidden">
        <Image
          src={heroImage}
          alt="Vehicle lineup"
          width={600}
          height={380}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
}