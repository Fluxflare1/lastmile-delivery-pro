import axios from "axios";
import { WalletAccount, WalletTransaction, WalletTransferPayload, ApiResponse } from "../types/wallet";

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
