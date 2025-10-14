import React from "react";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { WalletTransactions } from "./WalletTransactions";
import { WalletTransferForm } from "./WalletTransferForm";
import { WalletDepositModal } from "./WalletDepositModal";
import { useWallet } from "../../hooks/useWallet";

export const WalletDashboard: React.FC = () => {
  const { accountQuery } = useWallet();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WalletBalanceCard wallet={accountQuery.data} isLoading={accountQuery.isLoading} />
      <WalletDepositModal />
      <WalletTransferForm />
      <div className="md:col-span-2">
        <WalletTransactions />
      </div>
    </div>
  );
};
