"use client";
import React from "react";
import { useAuth } from "packages/shared/context/AuthContext";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function RoleGuard({ children, requiredRole = "admin" }: RoleGuardProps) {
  const { user } = useAuth();

  // If no required role or user has the required role, show children
  if (!requiredRole || user?.role === requiredRole) {
    return <>{children}</>;
  }

  return (
    <div className="p-6 text-center">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800">Access Denied</h3>
        <p className="text-yellow-700">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
}
