import axios from "axios";
import { saveAs } from "file-saver";
import { 
  WalletAccount, 
  WalletTransaction, 
  WalletDVA, 
  WalletTransferPayload, 
  ApiResponse,
  WalletTransactionFilters 
} from "../types/wallet";

// Single axios instance with proper configuration
const api = axios.create({
  baseURL: "/api/wallet",
  withCredentials: true,
  timeout: 30000, // 30 second timeout for financial operations
});

// ✅ Comprehensive interceptors for consistent error handling
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add tenant header if available
    const tenantId = localStorage.getItem("tenant_id");
    if (tenantId) {
      config.headers["X-Tenant-ID"] = tenantId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 
                   error.response?.data?.detail || 
                   "Something went wrong";
    
    // Handle specific HTTP status codes
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/auth/login';
    } else if (error.response?.status === 403) {
      console.error("Access forbidden:", message);
    }
    
    return Promise.reject(new Error(message));
  }
);

// Wallet Account Operations
export const walletApi = {
  // Account Management
  getWalletAccount: async (): Promise<WalletAccount> => {
    const { data } = await api.get<ApiResponse<WalletAccount>>("/account/");
    return data.data;
  },

  getWalletDVA: async (): Promise<WalletDVA> => {
    const { data } = await api.get<ApiResponse<WalletDVA>>("/dva/");
    return data.data;
  },

  refreshWalletDVA: async (): Promise<WalletDVA> => {
    const { data } = await api.post<ApiResponse<WalletDVA>>("/dva/refresh/");
    return data.data;
  },

  // Transaction Operations
  getWalletTransactions: async (filters?: WalletTransactionFilters): Promise<WalletTransaction[]> => {
    const params = new URLSearchParams();

    // Add filter parameters if provided
    if (filters) {
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      if (filters.transaction_type) params.append("transaction_type", filters.transaction_type);
      if (filters.status) params.append("status", filters.status);
      if (filters.minAmount) params.append("min_amount", filters.minAmount.toString());
      if (filters.maxAmount) params.append("max_amount", filters.maxAmount.toString());
      if (filters.search) params.append("search", filters.search);
    }

    const endpoint = filters ? `/transactions/?${params.toString()}` : "/transactions/";
    const { data } = await api.get<ApiResponse<WalletTransaction[]>>(endpoint);
    return data.data;
  },

  // Fund Operations
  transferFunds: async (payload: WalletTransferPayload): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>("/transfer/", payload);
    return data;
  },

  depositFunds: async (amount: number): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>("/deposit/", { amount });
    return data;
  },

  // Export Operations
  exportTransactionsCSV: async (filters?: WalletTransactionFilters): Promise<void> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      if (filters.transaction_type) params.append("transaction_type", filters.transaction_type);
    }

    const endpoint = filters 
      ? `/transactions/export/csv/?${params.toString()}`
      : "/transactions/export/csv/";

    const response = await api.get(endpoint, { responseType: "blob" });
    saveAs(response.data, `wallet_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  },

  exportTransactionsPDF: async (filters?: WalletTransactionFilters): Promise<void> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      if (filters.transaction_type) params.append("transaction_type", filters.transaction_type);
    }

    const endpoint = filters 
      ? `/transactions/export/pdf/?${params.toString()}`
      : "/transactions/export/pdf/";

    const response = await api.get(endpoint, { responseType: "blob" });
    saveAs(response.data, `wallet_transactions_${new Date().toISOString().split('T')[0]}.pdf`);
  }
};

// ✅ Single export for all wallet API functions
export default walletApi;
