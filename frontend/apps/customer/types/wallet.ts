// REPLACE existing with this CORRECTED version:

export interface WalletAccount {
  id: string;
  account_number: string;
  balance: number;
  currency: string;
  owner_name: string;
  account_type: string;
  dva?: WalletDVA;
}

export interface WalletTransaction {
  id: string;
  reference: string;
  transaction_type: "CREDIT" | "DEBIT";
  amount: number;
  balance_before: number;
  balance_after: number;
  narration: string; // ✅ CORRECT: matches backend field name
  status: "PENDING" | "SUCCESS" | "FAILED"; // ✅ CORRECT: matches backend values
  created_at: string;
}

export interface WalletTransferPayload {
  recipient_email_or_phone: string;
  amount: number;
  narration?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface WalletDVA {
  bank_name: string;
  account_number: string;
  account_name: string;
  provider: "PAYSTACK";
  status: "ACTIVE" | "INACTIVE";
}

// ✅ ADD the useful filters from new code, but corrected:
export interface WalletTransactionFilters {
  startDate?: string;
  endDate?: string;
  transaction_type?: "CREDIT" | "DEBIT"; // ✅ Correct field name
  status?: "PENDING" | "SUCCESS" | "FAILED"; // ✅ Correct values
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}
