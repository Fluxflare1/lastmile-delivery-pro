"use client";

import { useState } from "react";
import { registerUser, saveAuthTokens } from "../../lib/auth";

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    user_type: "sender",
    default_role: "sender",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(form);
      saveAuthTokens(data.tokens);
      alert("Registration successful!");
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
      <h2 className="text-2xl font-bold text-center">Create Account</h2>
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
        name="phone"
        placeholder="Phone Number"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />
      <select
        name="user_type"
        className="w-full border rounded p-2"
        onChange={handleChange}
        value={form.user_type}
      >
        <option value="sender">Sender</option>
        <option value="receiver">Receiver</option>
        <option value="both">Both</option>
      </select>

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
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
