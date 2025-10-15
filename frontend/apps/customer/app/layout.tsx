// frontend/apps/customer/app/layout.tsx
import React from "react";
import "../styles/globals.css";

export const metadata = {
  title: "Last Mile Delivery Pro – Customer App",
  description: "Customer portal for delivery booking, wallet, and tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
