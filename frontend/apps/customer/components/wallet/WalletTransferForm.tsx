import React, { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { useNotification } from "../notifications/useNotification"; // ✅ ADDED: Notification hook

export const WalletTransferForm: React.FC = () => {
  const { transferMutation, walletAccount } = useWallet();
  const { success, error } = useNotification(); // ✅ ADDED: Notification system
  
  const [formData, setFormData] = useState({
    recipient: "",
    amount: 0,
    narration: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.recipient || formData.amount <= 0) {
      error("Please fill all fields properly", {
        event_type: "wallet.transfer.validation_failed",
        metadata: { 
          recipient: formData.recipient,
          amount: formData.amount 
        },
      });
      return;
    }

    // Check sufficient balance
    if (walletAccount && formData.amount > walletAccount.balance) {
      error("Insufficient balance for this transfer", {
        event_type: "wallet.transfer.insufficient_balance",
        metadata: { 
          amount: formData.amount,
          current_balance: walletAccount.balance 
        },
      });
      return;
    }

    try {
      // ✅ USE: mutateAsync for proper promise handling
      await transferMutation.mutateAsync({
        recipient_email_or_phone: formData.recipient,
        amount: formData.amount,
        narration: formData.narration,
      });

      // ✅ SUCCESS: Notification from code 2
      success("Transfer successful!", {
        event_type: "wallet.transfer.success",
        metadata: { 
          amount: formData.amount, 
          receiver: formData.recipient 
        },
      });

      // Reset form on success
      setFormData({
        recipient: "",
        amount: 0,
        narration: ""
      });

    } catch (err: any) {
      // ✅ ERROR: Notification from code 2
      error("Transfer failed. Please try again.", {
        event_type: "wallet.transfer.failed",
        metadata: { 
          error_message: err.message,
          recipient: formData.recipient
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-2xl shadow space-y-3"
    >
      <h2 className="text-lg font-semibold">Transfer Funds</h2>
      
      {/* Recipient Input */}
      <div>
        <input
          type="text"
          placeholder="Recipient Email or Phone"
          className="border p-2 rounded w-full"
          value={formData.recipient}
          onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
        />
      </div>

      {/* Amount Input */}
      <div>
        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded w-full"
          value={formData.amount || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
          min="0"
          step="0.01"
        />
        {walletAccount && (
          <p className="text-sm text-gray-500 mt-1">
            Available: ₦{walletAccount.balance?.toLocaleString()}
          </p>
        )}
      </div>

      {/* Narration Input */}
      <div>
        <textarea
          placeholder="Narration (optional)"
          className="border p-2 rounded w-full"
          value={formData.narration}
          onChange={(e) => setFormData(prev => ({ ...prev, narration: e.target.value }))}
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={transferMutation.isPending}
        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {transferMutation.isPending ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Send Money"
        )}
      </button>
    </form>
  );
};
