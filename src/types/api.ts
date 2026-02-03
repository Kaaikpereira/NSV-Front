export type UserRole = 'dev' | 'admin';
export type AccountStatus = 'active' | 'blocked' | 'closed';
export type TransactionType = 'nix' | 'payment' | 'purchase' | 'transfer' | 'nix_send' | 'nix_receive';

export interface User {
  id: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
}

export interface Account {
  id: string;
  balance: number;
  currency: string;
  status: AccountStatus;
  account_display: string;
}

export interface MeResponse {
  user: User;
  account: Account;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  created_at: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  description?: string;
}

export interface CreateTransactionResponse {
  new_balance: number;
}

export interface NixTransferInput {
  to_account: string;
  amount: number;
  description?: string;
}

export interface NixTransferResponse {
  new_balance: number;
}

// Store items
export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}
