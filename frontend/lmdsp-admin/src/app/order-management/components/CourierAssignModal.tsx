"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CourierAssignModal({
  order,
  onClose,
  onUpdated,
}: {
  order: any;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [couriers, setCouriers] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/v1/lmdsp/couriers");
        setCouriers(res.data.data);
      } catch {
        toast.error("Failed to load couriers");
      }
    })();
  }, []);

  const handleAssign = async () => {
    if (!selected) return;
    try {
      await api.post(`/api/v1/lmdsp/orders/${order.id}/assign`, { courier_id: selected });
      toast.success("Courier assigned successfully");
      onUpdated();
      onClose();
    } catch {
      toast.error("Assignment failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Assign Courier</h2>
        <select
          className="border rounded-md p-2 w-full mb-4"
          onChange={(e) => setSelected(e.target.value)}
          value={selected || ""}
        >
          <option value="">Select courier...</option>
          {couriers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.vehicle_type})
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selected}>
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
}
