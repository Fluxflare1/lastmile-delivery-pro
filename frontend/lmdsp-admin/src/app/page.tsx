"use client";
import { useEffect } from "react";
import { useAuth } from "packages/shared/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) window.location.href = "/dashboard";
    else window.location.href = "/login";
  }, [user]);

  return <div>Redirecting...</div>;
}
