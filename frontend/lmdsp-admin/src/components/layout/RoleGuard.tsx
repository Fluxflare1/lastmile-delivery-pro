"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "packages/shared/context/AuthContext";
import { hasAccess } from "@/lib/roles";

const RoleGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  if (!hasAccess(user.user_type, pathname)) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Access Denied: You don’t have permission to view this page.
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
