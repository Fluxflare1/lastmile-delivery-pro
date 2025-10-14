import React from "react";
import { useWallet } from "../../hooks/useWallet";

export const WalletTransactions: React.FC = () => {
  const { transactionsQuery } = useWallet();
  const { data, isLoading } = transactionsQuery;

  return (
    <div className="bg-white rounded-2xl shadow p-5 mt-4">
      <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Narration</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((txn) => (
              <tr key={txn.id} className="border-b">
                <td>{new Date(txn.created_at).toLocaleString()}</td>
                <td>{txn.transaction_type}</td>
                <td>
                  {txn.transaction_type === "DEBIT" ? "-" : "+"}
                  {txn.amount.toFixed(2)}
                </td>
                <td>{txn.status}</td>
                <td>{txn.narration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
