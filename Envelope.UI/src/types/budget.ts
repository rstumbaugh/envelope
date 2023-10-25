import { Dictionary } from "lodash";

export interface Budget {
  id: string;
  name: string;
  accounts: Account[];
  categories: Category[];
  categoryGroups: CategoryGroup[];
  monthlyAssigned: Dictionary<MonthlyAssignments>;
}

export interface CategoryGroup {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  groupId: string;
  name: string;
}

export interface MonthlyAssignments {
  categoryAssigned: Dictionary<number>;
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

export const defaultAccount: Account = {
  id: "",
  name: "",
  balance: 0,
  clearedBalance: 0,
  unclearedBalance: 0,
  type: "CashAccount",
  isOpen: true,
};

export const defaultBudget: Budget = {
  id: "",
  name: "",
  accounts: [],
  categories: [],
  categoryGroups: [],
  monthlyAssigned: {},
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
