"use client";
import React from "react";
import { useAuth } from "packages/shared/context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">Welcome, {user?.name}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
