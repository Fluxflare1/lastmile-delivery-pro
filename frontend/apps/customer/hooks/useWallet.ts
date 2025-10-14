import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWalletAccount,
  getWalletTransactions,
  transferFunds,
  depositFunds,
} from "../services/walletApi";
import { WalletTransferPayload } from "../types/wallet";
import { toast } from "react-hot-toast";

export function useWallet() {
  const queryClient = useQueryClient();

  const accountQuery = useQuery({
    queryKey: ["wallet-account"],
    queryFn: getWalletAccount,
  });

  const transactionsQuery = useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: getWalletTransactions,
  });

  const transferMutation = useMutation({
    mutationFn: (payload: WalletTransferPayload) => transferFunds(payload),
    onSuccess: () => {
      toast.success("Transfer successful");
      queryClient.invalidateQueries(["wallet-account"]);
      queryClient.invalidateQueries(["wallet-transactions"]);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const depositMutation = useMutation({
    mutationFn: (amount: number) => depositFunds(amount),
    onSuccess: () => {
      toast.success("Deposit successful");
      queryClient.invalidateQueries(["wallet-account"]);
      queryClient.invalidateQueries(["wallet-transactions"]);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    accountQuery,
    transactionsQuery,
    transferMutation,
    depositMutation,
  };
}
