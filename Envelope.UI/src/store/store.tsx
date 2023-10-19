import _, { Dictionary, groupBy } from "lodash";
import { Budget, Transaction } from "../types/budget";
import { createContext, useEffect, useReducer } from "react";
import { useConnections } from "../util/ConnectionProvider";
import { produce } from "immer";

interface StoreType {
  budgets: Budget[];
  transactions: Transaction[];
  byAccountId: Dictionary<Transaction[]>;
}

const defaultStore: StoreType = {
  budgets: [],
  transactions: [],
  byAccountId: {},
};

export const StoreContext = createContext<StoreType>(defaultStore);

interface SetTransactionsAction {
  type: "SET_TRANSACTIONS";
  transactions: Transaction[];
}

interface DeleteTransactionAction {
  type: "DELETE_TRANSACTION";
  transaction: Transaction;
}

interface SetBudgetsAction {
  type: "SET_BUDGETS";
  budgets: Budget[];
}

type Action = SetTransactionsAction | DeleteTransactionAction | SetBudgetsAction;

function upsertTransactions(
  currTransactions: Transaction[],
  newTransactions: Transaction[],
): Transaction[] {
  return _.uniqBy(_.concat(newTransactions, currTransactions), (t) => t.id);
}

function groupByAccountId(transactions: Transaction[]) {
  return _.groupBy(transactions, (t) => t.accountId);
}

function populateBudgetBalances(store: StoreType) {
  return produce(store, (draftStore) => {
    draftStore.budgets = draftStore.budgets.map((b) => {
      b.accounts = b.accounts.map((a) => {
        return produce(a, (draft) => {
          const transactions = store.byAccountId[a.id];
          draft.balance = _.sumBy(transactions, (t) => t.amount);
        });
      });
      return b;
    });
  });
}

function reducer(store: StoreType, action: Action): StoreType {
  let newStore;

  switch (action.type) {
    case "SET_TRANSACTIONS": {
      const ts = upsertTransactions(store.transactions, action.transactions);

      newStore = produce(store, (draft) => {
        draft.transactions = ts;
        draft.byAccountId = groupByAccountId(ts);
      });
      break;
    }

    case "DELETE_TRANSACTION": {
      const ts = produce(store.transactions, (draft) => {
        const i = draft.findIndex((t) => t.id === action.transaction.id);
        if (i >= 0) draft.splice(i, 1);
      });

      newStore = produce(store, (draft) => {
        draft.transactions = ts;
        draft.byAccountId = groupByAccountId(ts);
      });

      break;
    }

    case "SET_BUDGETS": {
      newStore = produce(store, (draft) => {
        draft.budgets = action.budgets;
      });
      break;
    }
  }

  return populateBudgetBalances(newStore);
}

export default function StoreProvider(props: { children: any }) {
  const [store, dispatch] = useReducer(reducer, defaultStore);

  const { transactionConnection, budgetConnection } = useConnections();

  useEffect(() => {
    transactionConnection?.registerUpdateCallback((ts) => {
      dispatch({
        type: "SET_TRANSACTIONS",
        transactions: ts,
      });
    });

    transactionConnection?.registerDeleteCallback((t) => {
      dispatch({
        type: "DELETE_TRANSACTION",
        transaction: t,
      });
    });

    transactionConnection?.requestTransactions({});
  }, [transactionConnection]);

  useEffect(() => {
    budgetConnection?.registerCallback((bs) => {
      dispatch({
        type: "SET_BUDGETS",
        budgets: bs,
      });
    });
    budgetConnection?.requestBudgets();
  }, [budgetConnection]);

  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
}
