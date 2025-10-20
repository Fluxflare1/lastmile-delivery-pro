"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "packages/shared/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Courier {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle_type: string;
  active: boolean;
  total_deliveries: number;
  rating: number;
  performance_score: number;
}

interface AssignmentRequest {
  order_id: string;
  courier_id: string;
  assignment_type: "auto" | "manual";
}

export default function CourierManagementPage() {
  const { tenant } = useAuth();
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedCourierId, setSelectedCourierId] = useState("");

  const fetchCouriers = async () => {
    try {
      const res = await api.get("/api/v1/lmdsp/couriers", {
        params: { tenant_id: tenant?.id },
      });
      setCouriers(res.data.data);
    } catch {
      toast.error("Failed to fetch couriers");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async () => {
    if (!selectedOrderId || !selectedCourierId) {
      toast.error("Select both an order and a courier");
      return;
    }
    setAssigning(true);
    try {
      await api.post("/api/v1/lmdsp/couriers/assign", {
        order_id: selectedOrderId,
        courier_id: selectedCourierId,
        assignment_type: "manual",
      });
      toast.success("Courier assigned successfully");
    } catch {
      toast.error("Failed to assign courier");
    } finally {
      setAssigning(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, [tenant?.id]);

  if (loading)
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );

  return (
    <div className="space-y-10">
      {/* ======== COURIER PERFORMANCE ======== */}
      <Card>
        <CardHeader>
          <CardTitle>Courier Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Deliveries</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {couriers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.vehicle_type}</TableCell>
                  <TableCell>{c.total_deliveries}</TableCell>
                  <TableCell>{c.rating.toFixed(1)} ⭐</TableCell>
                  <TableCell>{c.performance_score}%</TableCell>
                  <TableCell>
                    <Badge variant={c.active ? "success" : "secondary"}>
                      {c.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ======== MANUAL ASSIGNMENT ======== */}
      <Card>
        <CardHeader>
          <CardTitle>Assign Courier to Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter Order ID..."
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
            />

            <Select onValueChange={(val) => setSelectedCourierId(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Courier" />
              </SelectTrigger>
              <SelectContent>
                {couriers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.vehicle_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAssignment} disabled={assigning}>
              {assigning ? "Assigning..." : "Assign Courier"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ======== PROFILE VIEW ======== */}
      <Card>
        <CardHeader>
          <CardTitle>Courier Profiles</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {couriers.map((c) => (
            <Card key={c.id} className="p-4">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-sm text-gray-500">{c.email}</p>
              <p className="text-sm text-gray-500">{c.phone}</p>
              <p className="text-sm text-gray-500 capitalize">{c.vehicle_type}</p>
              <div className="mt-2">
                <Badge variant={c.active ? "success" : "secondary"}>
                  {c.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Performance: {c.performance_score}% | Rating: {c.rating.toFixed(1)}⭐
              </p>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
