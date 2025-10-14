import React from "react";
import { WalletDashboard } from "../../components/wallet/WalletDashboard";

const WalletPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Wallet</h1>
      <WalletDashboard />
    </div>
  );
};

export default WalletPage;
