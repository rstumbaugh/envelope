import { HubConnection } from "@microsoft/signalR";
import { Budget } from "../../types/budget";
import { Connection } from "./connections";

const Messages = {
  OnBudgets: "OnBudgets",
};

const Endpoints = {
  RequestBudgets: "RequestBudgets",
};

type BudgetsUpdatedHandler = (budgets: Budget[]) => void;

export class BudgetConnection extends Connection {
  onUpdateCallbacks: BudgetsUpdatedHandler[];

  constructor(connection: HubConnection) {
    super(connection);

    this.onUpdateCallbacks = [];
  }

  initHandlers(): void {
    this.connection.on(Messages.OnBudgets, (budgets: Budget[]) => {
      this.onUpdateCallbacks.forEach((c) => c(budgets));
    });
  }

  onStart(): void {}

  registerCallback(c: BudgetsUpdatedHandler) {
    this.onUpdateCallbacks.push(c);
  }

  requestBudgets() {
    this.connectedPromise.then(() => {
      this.connection.send(Endpoints.RequestBudgets);
    });
  }
}
