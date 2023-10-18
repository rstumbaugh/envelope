import _, { Dictionary } from "lodash";
import { Transaction } from "../types/budget";
import { createContext, useEffect, useReducer } from "react";
import { useConnections } from "../util/ConnectionProvider";

interface StoreType {
  transactions: Transaction[];
  byAccountId: Dictionary<Transaction[]>;
}

const defaultStore: StoreType = {
  transactions: [],
  byAccountId: {},
};

export const StoreContext = createContext<StoreType>(defaultStore);

interface SetTransactionsAction {
  type: "SET_TRANSACTIONS";
  transactions: Transaction[];
}

type Action = SetTransactionsAction;

function upsertTransactions(
  currTransactions: Transaction[],
  newTransactions: Transaction[],
): Transaction[] {
  return _.uniqBy(_.concat(newTransactions, currTransactions), (t) => t.id);
}

function groupByAccountId(transactions: Transaction[]) {
  return _.groupBy(transactions, (t) => t.accountId);
}

function reducer(store: StoreType, action: Action): StoreType {
  switch (action.type) {
    case "SET_TRANSACTIONS": {
      const ts = upsertTransactions(store.transactions, action.transactions);

      return { ...store, transactions: ts, byAccountId: groupByAccountId(ts) };
    }
  }

  return store;
}

export default function StoreProvider(props: { children: any }) {
  const [store, dispatch] = useReducer(reducer, defaultStore);

  const { transactionConnection } = useConnections();

  useEffect(() => {
    transactionConnection?.registerCallback((ts) => {
      dispatch({
        type: "SET_TRANSACTIONS",
        transactions: ts,
      });
    });
    transactionConnection?.requestTransactions({});
  }, [transactionConnection]);

  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
}
