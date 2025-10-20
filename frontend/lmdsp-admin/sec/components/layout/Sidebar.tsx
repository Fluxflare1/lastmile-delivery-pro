"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "packages/shared/context/AuthContext";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Users, BarChart2, Settings } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.user_type || "dispatcher";

  const menu = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["owner", "manager", "dispatcher"] },
    { href: "/order-management", label: "Orders", icon: Package, roles: ["owner", "manager", "dispatcher"] },
    { href: "/courier-management", label: "Couriers", icon: Users, roles: ["owner", "manager"] },
    { href: "/analytics", label: "Analytics", icon: BarChart2, roles: ["owner", "manager"] },
    { href: "/settings", label: "Settings", icon: Settings, roles: ["owner"] },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">LMDSP Admin</div>
      <nav className="flex-1 p-2 space-y-2">
        {menu
          .filter(item => item.roles.includes(role))
          .map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
