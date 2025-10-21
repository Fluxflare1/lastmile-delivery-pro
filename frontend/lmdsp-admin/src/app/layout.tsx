"use client";
import React from "react";
import { AuthProvider, useAuth } from "packages/shared/context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import RoleGuard from "../components/layout/RoleGuard";
import { Toaster } from "sonner";
import "../styles/globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={`${inter.className} bg-gray-50 text-gray-900`}>
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
    // Instead of redirecting directly, you might want to show a login page
    if (typeof window !== "undefined") window.location.href = "/login";
    return <div className="p-6">Redirecting to login...</div>;
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
