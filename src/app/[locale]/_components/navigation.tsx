"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Link } from "@/navigation";
type itemsProps = {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
};

export default function Navigation() {
  const items: itemsProps[] = [
    {
      title: "mobiles-and-tablets.title",
      items: [
        {
          title: "mobiles-and-tablets.mobiles",
          href: "/mobiles",
        },
        {
          title: "mobiles-and-tablets.tablets",
          href: "/tablets",
        },
      ],
    },
    {
      title: "electronics.title",
      items: [
        {
          title: "electronics.computers",
          href: "/computers",
        },
        {
          title: "electronics.laptops",
          href: "/laptops",
        },
      ],
    },
  ];
  return (
    <div className="flex items-center justify-center">
      {items.map((item) => {
        const { items, title } = item;
        return <ItemDropdown key={title} title={title} items={items} />;
      })}
    </div>
  );
}
function ItemDropdown({ title, items }: itemsProps) {
  const [openHoverCard, setOpenHoverCard] = useState(false);
  const t = useTranslations("/.navigation");
  return (
    <HoverCard closeDelay={50} openDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="ghost">{t(title)}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="min-w-[150px] p-0">
        {items.map((child) => {
          const { title, href } = child;
          return (
            <Link key={title} href={href}>
              <li className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-secondary hover:text-secondary-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                {t(title)}
              </li>
            </Link>
          );
        })}
      </HoverCardContent>
    </HoverCard>
  );
}
