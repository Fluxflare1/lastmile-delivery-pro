// frontend/apps/customer/app/layout.tsx
import "../globals.css";
import React from "react";

export const metadata = {
  title: "Last Mile Delivery Pro – Customer App",
  description: "Customer portal for deliveries, wallet, and tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
