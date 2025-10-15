// frontend/apps/customer/app/(dashboard)/layout.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/wallet", label: "Wallet" },
  { href: "/dashboard/orders", label: "Orders" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">
          Customer Dashboard
        </h1>
        <nav className="flex space-x-6">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`${
                pathname === n.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">{children}</main>

      <footer className="bg-white border-t text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Last Mile Delivery Pro
      </footer>
    </div>
  );
}
