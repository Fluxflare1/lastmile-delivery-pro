import axios from "axios";
import { WalletAccount, WalletTransaction, WalletDVA, WalletTransferPayload, ApiResponse } from "../types/wallet";
import { saveAs } from "file-saver";

const api = axios.create({
  baseURL: "/api/wallet",
  withCredentials: true,
});

// ✅ Add interceptors for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const getWalletAccount = async (): Promise<WalletAccount> => {
  const { data } = await api.get<ApiResponse<WalletAccount>>("/account/");
  return data.data;
};

export const getWalletTransactions = async (): Promise<WalletTransaction[]> => {
  const { data } = await api.get<ApiResponse<WalletTransaction[]>>("/transactions/");
  return data.data;
};

export const transferFunds = async (payload: WalletTransferPayload): Promise<ApiResponse<any>> => {
  const { data } = await api.post<ApiResponse<any>>("/transfer/", payload);
  return data;
};

export const depositFunds = async (amount: number): Promise<ApiResponse<any>> => {
  const { data } = await api.post<ApiResponse<any>>("/deposit/", { amount });
  return data;
};




export const getWalletDVA = async (): Promise<WalletDVA> => {
  const { data } = await api.get<ApiResponse<WalletDVA>>("/dva/");
  return data.data;
};

export const refreshWalletDVA = async (): Promise<WalletDVA> => {
  const { data } = await api.post<ApiResponse<WalletDVA>>("/dva/refresh/");
  return data.data;
};




export const exportTransactionsCSV = async (): Promise<void> => {
  const response = await api.get("/wallet/transactions/export/csv/", {
    responseType: "blob",
  });
  saveAs(response.data, "wallet_transactions.csv");
};

export const exportTransactionsPDF = async (): Promise<void> => {
  const response = await api.get("/wallet/transactions/export/pdf/", {
    responseType: "blob",
  });
  saveAs(response.data, "wallet_transactions.pdf");
};
