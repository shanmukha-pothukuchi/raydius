"use client";

import {
  Bell,
  Home,
  Map,
  MessageSquare,
  Plus,
  User,
  type LucideProps,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { usePathname } from "next/navigation";

const navItems: {
  text: string;
  link: string;
  icon: React.ComponentType<LucideProps>;
}[] = [
  { text: "Home", link: "/", icon: Home },
  { text: "Map", link: "/map", icon: Map },
  {
    text: "Notifications",
    link: "/notifications",
    icon: Bell,
  },
  { text: "Messages", link: "/messages", icon: MessageSquare },
  { text: "Profile", link: "/profile", icon: User },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col gap-8">
      <Link href="/" className="cursor-pointer text-2xl font-bold">
        Raydius
      </Link>
      {navItems.map(({ text, link, icon }, i) => (
        <Item key={i} link={link} text={text} icon={icon} />
      ))}
      {pathname !== "/new" && (
        <Button className="mt-auto space-x-2 rounded-full" asChild>
          <Link href="/new">
            <Plus className="h-[1.15em] w-[1.15em]" />
            <p>New</p>
          </Link>
        </Button>
      )}
    </div>
  );
};

type ItemProps = {
  text: string;
  link: string;
  icon: React.ComponentType<LucideProps>;
};
const Item = ({ text, link, icon: Icon }: ItemProps) => {
  return (
    <Link
      href={link}
      className="flex cursor-pointer items-center gap-4 text-lg"
    >
      <span>
        <Icon className="h-[1.15em] w-[1.15em]" />
      </span>
      <span>{text}</span>
    </Link>
  );
};
