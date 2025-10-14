import React, { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { toast } from "react-hot-toast";

declare const PaystackPop: any;

export const WalletDepositModal: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const { depositMutation } = useWallet();

  const handleDeposit = () => {
    if (amount <= 0) return toast.error("Enter a valid amount");

    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: "user@example.com", // ideally from context
      amount: amount * 100,
      onClose: () => toast("Deposit cancelled"),
      callback: (response: any) => {
        depositMutation.mutate(amount);
      },
    });
    handler.openIframe();
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-3">Deposit Funds</h2>
      <input
        type="number"
        className="border p-2 rounded w-full"
        placeholder="Enter amount"
        value={amount || ""}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      <button
        onClick={handleDeposit}
        disabled={depositMutation.isPending}
        className="bg-blue-600 text-white rounded-lg mt-3 py-2 px-4 hover:bg-blue-700 w-full"
      >
        {depositMutation.isPending ? "Processing..." : "Deposit Now"}
      </button>
    </div>
  );
};
