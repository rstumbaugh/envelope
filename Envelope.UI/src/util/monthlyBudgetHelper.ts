import moment from "moment";
import { Transaction } from "../types/budget";

export const fmt = "YYYYMM";

export function getMonthString(curr: string, direction: -1 | 1): string {
  const m = moment(curr, fmt);
  return m.add(direction, "M").format(fmt);
}

export function formatMonthString(curr: string): string {
  return moment(curr, fmt).format("MMM YYYY");
}

export function filterTransactionsForMonth(transactions: Transaction[], month: string) {
  const monthStart = moment(month, fmt);
  const nextMonthStart = moment(month, fmt).add(1, "M");

  return transactions.filter(
    (t) => moment(t.timestamp) >= monthStart && moment(t.timestamp) < nextMonthStart,
  );
}
