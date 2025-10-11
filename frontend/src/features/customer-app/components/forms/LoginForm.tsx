"use client";

import { useState } from "react";
import { loginUser, saveAuthTokens } from "../../lib/auth";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);
      saveAuthTokens(data.tokens);
      alert("Login successful!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        name="email"
        placeholder="Email"
        type="email"
        required
        className="w-full border rounded p-2"
        onChange={handleChange}
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        required
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <button
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
