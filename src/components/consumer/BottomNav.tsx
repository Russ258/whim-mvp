"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarClock, BellRing } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Discover", icon: Home },
  { href: "/bookings", label: "Bookings", icon: CalendarClock },
  { href: "/profile", label: "Profile", icon: BellRing },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto mb-4 w-[95%] max-w-xl rounded-full border border-charcoal/10 bg-white p-3 text-sm text-charcoal shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-1 flex-col items-center gap-1 rounded-full px-2 py-1 transition",
                isActive ? "bg-coral text-charcoal" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
