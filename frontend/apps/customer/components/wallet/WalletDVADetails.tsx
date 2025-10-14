import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getWalletDVA, refreshWalletDVA } from "../../services/walletApi";
import { WalletDVA } from "../../types/wallet";
import { toast } from "react-hot-toast";
import { Copy, RefreshCcw } from "lucide-react";

export const WalletDVADetails: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, refetch } = useQuery<WalletDVA>({
    queryKey: ["wallet-dva"],
    queryFn: getWalletDVA,
  });

  const refreshMutation = useMutation({
    mutationFn: refreshWalletDVA,
    onSuccess: (data) => {
      toast.success("DVA refreshed successfully");
      refetch();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCopy = () => {
    if (!data?.account_number) return;
    navigator.clipboard.writeText(data.account_number);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow text-center">
        <p className="text-gray-600 mb-2">No virtual account assigned.</p>
        <button
          onClick={() => refreshMutation.mutate()}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Generate Virtual Account
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bank Transfer Deposit</h2>
        <button
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
          className="text-blue-600 flex items-center gap-1 hover:underline"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      <p className="text-gray-700">
        Use the following virtual account to fund your wallet directly from any
        bank app.
      </p>

      <div className="mt-3 bg-gray-50 p-4 rounded-lg border">
        <p className="text-sm text-gray-600">Bank Name</p>
        <p className="font-medium text-gray-900">{data.bank_name}</p>

        <p className="text-sm text-gray-600 mt-2">Account Number</p>
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-900">{data.account_number}</p>
          <button
            onClick={handleCopy}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <Copy size={16} /> {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-2">Account Name</p>
        <p className="font-medium text-gray-900">{data.account_name}</p>

        <p
          className={`text-xs mt-3 font-semibold ${
            data.status === "ACTIVE" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {data.status}
        </p>
      </div>
    </div>
  );
};
