import { Dictionary, random } from "lodash";
import { Connection } from "../../api/connection/connections";
import { Transaction } from "../../types/budget";
import { HubConnection } from "@microsoft/signalR";

const Messages = {
  OnTransactions: "OnTransactions",
};

const Endpoints = {
  RequestTransactions: "RequestTransactions",
  UpdateTransaction: "UpdateTransaction",
};

interface TransactionRequest {
  accountId?: string;
}

type TransactionsUpdatedHandler = (transactions: Transaction[]) => void;

export class TransactionConnection extends Connection {
  onUpdateCallbacks: TransactionsUpdatedHandler[];
  id: number;

  constructor(connection: HubConnection) {
    super(connection);

    this.onUpdateCallbacks = [];
    this.id = random(10000);
  }

  initHandlers(): void {
    console.log("handlers for", this.id);
    this.connection.on(Messages.OnTransactions, (transactions: Transaction[]) => {
      this.onUpdateCallbacks.forEach((c) => c(transactions));
    });
  }

  onStart(): void {}

  registerCallback(c: TransactionsUpdatedHandler) {
    console.log("registering callback");
    this.onUpdateCallbacks.push(c);
  }

  requestTransactions(req: TransactionRequest) {
    this.connectedPromise.then(() => {
      this.connection.send(Endpoints.RequestTransactions, req);
    });
  }

  editTransaction(newTransaction: Transaction) {
    console.log("editing transaction", this.id);
    this.connectedPromise.then(() => {
      this.connection.send(Endpoints.UpdateTransaction, newTransaction);
    });
  }
}
