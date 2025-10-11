"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddresses } from "./hooks/useAddresses";

const AddressSchema = z.object({
  address_type: z.string(),
  address_line_1: z.string().min(2, "Required"),
  address_line_2: z.string().optional(),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  country: z.string().min(2, "Required"),
  zip_code: z.string().optional(),
  instructions: z.string().optional(),
});

export default function AddressForm() {
  const { createAddress } = useAddresses();
  const form = useForm({ resolver: zodResolver(AddressSchema) });

  const handleSubmit = (values: any) => createAddress(values);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Address Type" {...form.register("address_type")} />
        <Input placeholder="City" {...form.register("city")} />
        <Input placeholder="State" {...form.register("state")} />
        <Input placeholder="Country" {...form.register("country")} />
        <Input placeholder="Zip Code" {...form.register("zip_code")} />
      </div>
      <Input placeholder="Address Line 1" {...form.register("address_line_1")} />
      <Input placeholder="Address Line 2" {...form.register("address_line_2")} />
      <Input placeholder="Delivery Instructions" {...form.register("instructions")} />
      <Button type="submit">Save Address</Button>
    </form>
  );
}
