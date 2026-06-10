"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";

const listItems = [
  {
    icon: <UserIcon className="h-4 w-4" />,
    property: "Profile",
  },
  {
    icon: <SettingsIcon className="h-4 w-4" />,
    property: "Settings",
  },
  {
    icon: <CreditCardIcon className="h-4 w-4" />,
    property: "Billing",
  },
  {
    icon: <BellIcon className="h-4 w-4" />,
    property: "Notifications",
  },
  {
    icon: <LogOutIcon className="h-4 w-4" />,
    property: "Sign Out",
  },
];

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage
              src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
              alt="User"
            />
            <AvatarFallback className="text-xs">HR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          {listItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center gap-2"
            >
              {item.icon}
              <span>{item.property}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}