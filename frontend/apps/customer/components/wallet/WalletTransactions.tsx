import React from "react";
import { useWallet } from "../../hooks/useWallet";
import { WalletTransactionExport } from "./WalletTransactionExport";

export const WalletTransactions: React.FC = () => {
  const { transactionsQuery } = useWallet();
  const { data, isLoading, error } = transactionsQuery;

  // ✅ FIX: Use narration instead of description (matches your backend)
  // ✅ FIX: Proper transaction type handling with signs

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <WalletTransactionExport />
      </div>

      {isLoading ? (
        <p className="text-gray-500 animate-pulse">Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load transactions</p>
      ) : data?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Narration</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((txn) => (
                <tr key={txn.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 whitespace-nowrap">
                    {new Date(txn.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      txn.transaction_type === "CREDIT" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {txn.transaction_type}
                    </span>
                  </td>
                  <td className="p-2 max-w-xs truncate" title={txn.narration}>
                    {txn.narration || "No description"}
                  </td>
                  <td className={`p-2 text-right font-medium ${
                    txn.transaction_type === "CREDIT" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {txn.transaction_type === "CREDIT" ? "+" : "-"}
                    {txn.amount.toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      txn.status === "SUCCESS" 
                        ? "bg-green-100 text-green-800"
                        : txn.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No transactions found. Your transaction history will appear here.
        </p>
      )}
    </div>
  );
};
