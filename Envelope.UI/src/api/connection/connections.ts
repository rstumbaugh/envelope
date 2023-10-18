import { HubConnection } from "@microsoft/signalR";
import _ from "lodash";

export interface PromiseHandlers<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

export abstract class Connection {
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
