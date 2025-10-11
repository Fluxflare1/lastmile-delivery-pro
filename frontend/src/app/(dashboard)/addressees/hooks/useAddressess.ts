"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export function useAddresses() {
  const [addresses, setAddresses] = useState<any[]>([]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/addresses/");
      setAddresses(res.data);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  const createAddress = async (data: any) => {
    try {
      const res = await api.post("/addresses/", data);
      setAddresses((prev) => [res.data, ...prev]);
      toast.success("Address added");
    } catch {
      toast.error("Failed to add address");
    }
  };

  const updateAddress = async (id: number, data: any) => {
    try {
      const res = await api.put(`/addresses/${id}/`, data);
      setAddresses((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      toast.success("Address updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      await api.delete(`/addresses/${id}/`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return { addresses, createAddress, updateAddress, deleteAddress };
}
