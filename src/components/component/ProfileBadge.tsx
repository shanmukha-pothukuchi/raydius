import { ChevronDown, LogOut, User } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type ProfileBadgeProps = {
  name: string;
  username: string;
  profilePicture?: string;
};

export const ProfileBadge = ({
  name,
  username,
  profilePicture,
}: ProfileBadgeProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex w-full justify-start rounded-full py-6"
          variant="outline"
        >
          <Avatar className="-ml-3">
            <AvatarImage src={profilePicture} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((v) => v.substring(0, 1))
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2 flex-1 text-left">
            <h1 className="truncate text-sm">{name}</h1>
            <p className="truncate text-xs text-stone-500">@{username}</p>
          </div>
          <ChevronDown className="h-[1.15em] w-[1.15em]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
        <DropdownMenuItem className="space-x-2">
          <User className="h-[1.15em] w-[1.15em]" />
          <p>Profile</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="space-x-2">
          <LogOut className="h-[1.15em] w-[1.15em]" />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
