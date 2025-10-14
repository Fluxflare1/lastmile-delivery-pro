import React from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  exportTransactionsCSV,
  exportTransactionsPDF,
} from "../../services/walletApi";

export const WalletTransactionExport: React.FC = () => {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleExport = async (type: "csv" | "pdf") => {
    try {
      setLoading(type);
      if (type === "csv") {
        await exportTransactionsCSV();
      } else {
        await exportTransactionsPDF();
      }
      toast.success(`Transactions exported as ${type.toUpperCase()}`);
    } catch (err: any) {
      toast.error("Failed to export transactions");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-3 justify-end mb-4">
      <button
        onClick={() => handleExport("csv")}
        disabled={loading === "csv"}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
      >
        <FileSpreadsheet size={18} />
        {loading === "csv" ? "Exporting..." : "Export CSV"}
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={loading === "pdf"}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-60"
      >
        <FileText size={18} />
        {loading === "pdf" ? "Exporting..." : "Export PDF"}
      </button>
    </div>
  );
};
