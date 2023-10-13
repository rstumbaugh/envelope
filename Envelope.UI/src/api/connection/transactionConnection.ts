import { Dictionary } from "lodash";
import { Connection, useConnection } from "../../api/connection/connections";
import { Transaction } from "../../types/budget";
import { HubConnection } from "@microsoft/signalR";

const Messages = {
  OnTransactions: "OnTransactions",
};

const Endpoints = {
  RequestTransactions: "RequestTransactions",
};

interface TransactionRequest {
  accountId: string;
}

type TransactionsUpdatedHandler = () => void;

class TransactionConnection extends Connection {
  accountTransactions: Dictionary<Transaction[]>;
  onUpdateCallbacks: TransactionsUpdatedHandler[];

  constructor(connection: HubConnection) {
    super(connection);

    this.accountTransactions = {};
    this.onUpdateCallbacks = [];
  }

  initHandlers(): void {
    this.connection.on(Messages.OnTransactions, (transactions: Transaction[]) => {
      console.log("received transactions", transactions);
      transactions.forEach((t) => {
        if (!(t.accountId in this.accountTransactions)) this.accountTransactions[t.accountId] = [];

        this.accountTransactions[t.accountId].push(t);
      });

      this.onUpdateCallbacks.forEach((c) => c());
    });
  }

  onStart(): void {}

  registerCallback(c: TransactionsUpdatedHandler) {
    this.onUpdateCallbacks.push(c);
  }

  requestTransactions(req: TransactionRequest) {
    this.connectedPromise.then(() => {
      this.connection.send(Endpoints.RequestTransactions, req);
    });
  }
}

export function useTransactionConnection() {
  return useConnection(TransactionConnection, "/hubTransaction");
}
