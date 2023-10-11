import { HubConnectionBuilder, HubConnection } from "@microsoft/signalR";
import { useContext, useEffect, useState } from "react";
import { apiBase } from "./api";
import { CredentialContext } from "../util/GoogleCredentialsProvider";
import _, { Dictionary } from "lodash";
import { Budget } from "../types/budget";

const Messages = {
  OnBudget: "OnBudget",
};

const Endpoints = {
  RequestBudget: "RequestBudget",
};

interface PromiseHandlers<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

abstract class Connection {
  connection: HubConnection;
  connectedPromise: Promise<void>;

  abstract initHandlers(): void;
  abstract onStart(): void;

  constructor(connection: HubConnection) {
    this.connection = connection;
    this.connectedPromise = new Promise<void>(() => {});
  }

  start() {
    this.initHandlers();

    this.connectedPromise = this.connection.start();

    this.connectedPromise
      .then(() => {
        this.onStart();
      })
      .catch((err) => console.error("error connecting", err));
  }
}

class BudgetConnection extends Connection {
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

export function useBudgetConnection() {
  const [credentials] = useContext(CredentialContext);
  const [connection, setConnection] = useState<BudgetConnection>();

  useEffect(() => {
    if (!credentials) return;
    if (connection) return;

    const c = new HubConnectionBuilder()
      .withUrl(`${apiBase}/hubBudget`, {
        accessTokenFactory: () => credentials,
      })
      .build();
    const budgetConn = new BudgetConnection(c);
    budgetConn.start();
    setConnection(budgetConn);
  }, [connection, credentials]);

  return connection;
}
