import { Dictionary, random } from "lodash";
import { Connection } from "../../api/connection/connections";
import { Transaction } from "../../types/budget";
import { HubConnection } from "@microsoft/signalR";

const Messages = {
  OnTransactions: "OnTransactions",
  OnDeleted: "OnDeleted",
};

const Endpoints = {
  RequestTransactions: "RequestTransactions",
  UpdateTransaction: "UpdateTransaction",
  AddTransaction: "AddTransaction",
  DeleteTransaction: "DeleteTransaction",
};

interface TransactionRequest {
  accountId?: string;
}

type TransactionsUpdatedHandler = (transactions: Transaction[]) => void;
type TransactionDeletedHandler = (transaction: Transaction) => void;

export class TransactionConnection extends Connection {
  onDeletedCallbacks: TransactionDeletedHandler[];
  onUpdateCallbacks: TransactionsUpdatedHandler[];
  id: number;

  constructor(connection: HubConnection) {
    super(connection);

    this.onUpdateCallbacks = [];
    this.onDeletedCallbacks = [];
    this.id = random(10000);
  }

  initHandlers(): void {
    this.connection.on(Messages.OnTransactions, (transactions: Transaction[]) => {
      this.onUpdateCallbacks.forEach((c) => c(transactions));
    });

    this.connection.on(Messages.OnDeleted, (t: Transaction) => {
      this.onDeletedCallbacks.forEach((c) => c(t));
    });
  }

  onStart(): void {}

  registerUpdateCallback(c: TransactionsUpdatedHandler) {
    console.log("registering callback");
    this.onUpdateCallbacks.push(c);
  }

  registerDeleteCallback(c: TransactionDeletedHandler) {
    this.onDeletedCallbacks.push(c);
  }

  requestTransactions(req: TransactionRequest) {
    this.connectedPromise.then(() => {
      this.connection.send(Endpoints.RequestTransactions, req);
    });
  }

  editTransaction(newTransaction: Transaction) {
    this.connectedPromise.then(() => {
      this.connection.send(Endpoints.UpdateTransaction, newTransaction);
    });
  }

  addTransaction(t: Transaction) {
    this.connectedPromise.then(() => {
      this.connection.send(Endpoints.AddTransaction, t);
    });
  }

  deleteTransaction(t: Transaction) {
    this.connectedPromise.then(() => {
      this.connection.send(Endpoints.DeleteTransaction, t);
    });
  }
}
