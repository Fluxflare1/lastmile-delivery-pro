import React, { useState } from "react";
import { useWallet } from "../../hooks/useWallet";

export const WalletTransferForm: React.FC = () => {
  const { transferMutation } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [narration, setNarration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || amount <= 0) return alert("Fill all fields properly");

    transferMutation.mutate({
      recipient_email_or_phone: recipient,
      amount,
      narration,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-2xl shadow space-y-3"
    >
      <h2 className="text-lg font-semibold">Transfer Funds</h2>
      <input
        type="text"
        placeholder="Recipient Email or Phone"
        className="border p-2 rounded w-full"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        className="border p-2 rounded w-full"
        value={amount || ""}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      <textarea
        placeholder="Narration (optional)"
        className="border p-2 rounded w-full"
        value={narration}
        onChange={(e) => setNarration(e.target.value)}
      />
      <button
        type="submit"
        disabled={transferMutation.isPending}
        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
      >
        {transferMutation.isPending ? "Transferring..." : "Send"}
      </button>
    </form>
  );
};
