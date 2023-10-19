export interface Budget {
  id: string;
  name: string;
  accounts: Account[];
}

export type AccountType = "CashAccount" | "CreditCard" | "Loan" | "Tracking";

export interface Account {
  id: string;
  name: string;
  balance: number;
  clearedBalance: number;
  unclearedBalance: number;
  type: AccountType;
  isOpen: boolean;
}

export const defaultBudget: Budget = {
  id: "",
  name: "",
  accounts: [],
};

export interface Transaction {
  id: string;
  accountId: string;
  timestamp: Date;
  payee: string;
  categoryId: string;
  note: string;
  amount: number;
  isCleared: boolean;
}

export const getNewTransaction = (accountId: string): Transaction => ({
  id: crypto.randomUUID(),
  accountId,
  timestamp: new Date(),
  payee: "",
  categoryId: "",
  note: "",
  amount: 0,
  isCleared: true,
});
