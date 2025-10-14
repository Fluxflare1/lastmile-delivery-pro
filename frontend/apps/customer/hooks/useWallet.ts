import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import walletApi from "../services/walletApi";
import { 
  WalletTransferPayload, 
  WalletTransactionFilters 
} from "../types/wallet";

export function useWallet() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<WalletTransactionFilters>({});

  // ✅ Account Query
  const accountQuery = useQuery({
    queryKey: ["wallet", "account"],
    queryFn: walletApi.getWalletAccount,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
    onError: (error: Error) => {
      toast.error(`Failed to load wallet: ${error.message}`);
    }
  });

  // ✅ Transactions Query with Filters
  const transactionsQuery = useQuery({
    queryKey: ["wallet", "transactions", filters],
    queryFn: () => walletApi.getWalletTransactions(filters),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes cache for transactions
    onError: (error: Error) => {
      toast.error(`Failed to load transactions: ${error.message}`);
    }
  });

  // ✅ Transfer Mutation
  const transferMutation = useMutation({
    mutationFn: (payload: WalletTransferPayload) => 
      walletApi.transferFunds(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Transfer completed successfully");
      
      // ✅ Invalidate and refetch all wallet-related queries
      queryClient.invalidateQueries({ queryKey: ["wallet", "account"] });
      queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
      
      // ✅ Reset filters after successful transfer
      setFilters({});
    },
    onError: (error: Error) => {
      toast.error(error.message || "Transfer failed");
    }
  });

  // ✅ Deposit Mutation
  const depositMutation = useMutation({
    mutationFn: (amount: number) => walletApi.depositFunds(amount),
    onSuccess: (data) => {
      toast.success(data.message || "Deposit initiated successfully");
      
      // ✅ Invalidate wallet data
      queryClient.invalidateQueries({ queryKey: ["wallet", "account"] });
      queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Deposit failed");
    }
  });

  // ✅ Export Transactions
  const exportCSVMutation = useMutation({
    mutationFn: () => walletApi.exportTransactionsCSV(filters),
    onSuccess: () => {
      toast.success("Transactions exported as CSV");
    },
    onError: (error: Error) => {
      toast.error(`Export failed: ${error.message}`);
    }
  });

  const exportPDFMutation = useMutation({
    mutationFn: () => walletApi.exportTransactionsPDF(filters),
    onSuccess: () => {
      toast.success("Transactions exported as PDF");
    },
    onError: (error: Error) => {
      toast.error(`Export failed: ${error.message}`);
    }
  });

  // ✅ Clear filters
  const clearFilters = () => setFilters({});

  return {
    // Queries
    accountQuery,
    transactionsQuery,
    
    // Mutations
    transferMutation,
    depositMutation,
    exportCSVMutation,
    exportPDFMutation,
    
    // Filter state management
    filters,
    setFilters,
    clearFilters,
    
    // Convenience properties
    walletAccount: accountQuery.data,
    transactions: transactionsQuery.data,
    isLoading: accountQuery.isLoading || transactionsQuery.isLoading,
    isError: accountQuery.isError || transactionsQuery.isError
  };
}
