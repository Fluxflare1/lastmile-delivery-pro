"use client";
import React from "react";
import { AuthProvider, useAuth } from "packages/shared/context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import RoleGuard from "../components/layout/RoleGuard";
import { Toaster } from "sonner";
import "../styles/globals.css";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className="bg-gray-50 text-gray-900">
      <AuthProvider>
        <AppShell>{children}</AppShell>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </body>
  </html>
);

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          <RoleGuard>{children}</RoleGuard>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;





const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMDSP Admin',
  description: 'Last Mile Delivery Service Provider Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">LMDSP Admin</Link>
            <div className="space-x-4">
              <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link href="/couriers" className="hover:text-blue-200">Couriers</Link>
              <Link href="/orders" className="hover:text-blue-200">Orders</Link>
              <Link href="/tracking" className="hover:text-blue-200">Tracking</Link>
              <Link href="/analytics" className="hover:text-blue-200">Analytics</Link>
              <Link href="/payments" className="hover:text-blue-200">Payments</Link>
              <Link href="/notifications" className="hover:text-blue-200">Notifications</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
