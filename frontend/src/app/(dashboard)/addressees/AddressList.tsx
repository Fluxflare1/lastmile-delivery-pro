"use client";

import { useAddresses } from "./hooks/useAddresses";
import { Button } from "@/components/ui/button";

export default function AddressList() {
  const { addresses, deleteAddress } = useAddresses();

  return (
    <div className="mt-6 space-y-4">
      {addresses.length === 0 ? (
        <p>No addresses yet</p>
      ) : (
        addresses.map((addr) => (
          <div
            key={addr.id}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold">{addr.address_type}</h3>
              <p>{addr.address_line_1}</p>
              <p>
                {addr.city}, {addr.state}, {addr.country}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => deleteAddress(addr.id)}
            >
              Delete
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
