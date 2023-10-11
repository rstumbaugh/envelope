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
