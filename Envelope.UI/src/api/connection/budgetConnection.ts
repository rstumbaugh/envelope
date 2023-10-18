import { HubConnection } from "@microsoft/signalR";
import { Dictionary } from "lodash";
import { Budget } from "../../types/budget";
import { Connection, PromiseHandlers } from "./connections";

const Messages = {
  OnBudget: "OnBudget",
};

const Endpoints = {
  RequestBudget: "RequestBudget",
};

export class BudgetConnection extends Connection {
  budgetPromises: Dictionary<PromiseHandlers<Budget>>;

  constructor(connection: HubConnection) {
    super(connection);

    this.budgetPromises = {};
  }

  initHandlers(): void {
    this.connection.on(Messages.OnBudget, (budget: Budget) => {
      this.budgetPromises[budget.id].resolve(budget);
    });
  }

  onStart(): void {}

  getBudget(id: string) {
    if (id in this.budgetPromises) return this.budgetPromises[id].promise;

    return this.connectedPromise.then(() => {
      let handlers: Pick<
        PromiseHandlers<Budget>,
        "resolve" | "reject"
      > = {} as PromiseHandlers<Budget>;

      const p = new Promise<Budget>((resolve, reject) => {
        handlers = { resolve, reject };
      });

      this.budgetPromises[id] = { ...handlers, promise: p };

      this.connection.send(Endpoints.RequestBudget, id);

      return p;
    });
  }
}
