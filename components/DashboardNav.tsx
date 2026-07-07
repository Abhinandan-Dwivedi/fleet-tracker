"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface DashboardNavProps {
  userName: string;
  userRole: string;
}

export function DashboardNav({ userName, userRole }: DashboardNavProps) {
  const pathname = usePathname();

  const staffLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/drivers", label: "Drivers" },
    { href: "/dashboard/deliveries", label: "Deliveries" },
    { href: "/dashboard/map", label: "Live Map" },
  ];

  const customerLinks = [{ href: "/dashboard", label: "Overview" }];

  const links = userRole === "CUSTOMER" ? customerLinks : staffLinks;

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold">Fleet Tracker</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm ${
              pathname === link.href
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {userName} · <span className="uppercase text-xs">{userRole}</span>
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}