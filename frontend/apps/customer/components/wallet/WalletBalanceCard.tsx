import React from "react";
import { WalletAccount } from "../../types/wallet";

interface Props {
  wallet: WalletAccount | undefined;
  isLoading: boolean;
}

export const WalletBalanceCard: React.FC<Props> = ({ wallet, isLoading }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-5 flex flex-col gap-1 text-center">
      {isLoading ? (
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2 mx-auto" />
      ) : (
        <>
          <h3 className="text-gray-600">Available Balance</h3>
          <h1 className="text-3xl font-bold">
            {wallet?.currency} {wallet?.balance.toFixed(2)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Account: {wallet?.account_number}
          </p>
        </>
      )}
    </div>
  );
};
