// frontend/apps/customer/app/(dashboard)/layout.tsx
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-md py-4 px-6">
        <h1 className="text-xl font-semibold">Customer Dashboard</h1>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
