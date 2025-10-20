"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function OrderForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    sender_name: "",
    recipient_name: "",
    origin: "",
    destination: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/lmdsp/orders", form);
      toast.success("Order created successfully");
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
        <h2 className="text-lg font-semibold mb-4">New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="sender_name" placeholder="Sender Name" onChange={handleChange} required />
          <Input name="recipient_name" placeholder="Recipient Name" onChange={handleChange} required />
          <Input name="origin" placeholder="Origin Address" onChange={handleChange} required />
          <Input name="destination" placeholder="Destination Address" onChange={handleChange} required />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
