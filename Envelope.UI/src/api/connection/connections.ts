import { HubConnectionBuilder, HubConnection } from "@microsoft/signalR";
import { useContext, useEffect, useState } from "react";
import { apiBase } from "../api";
import { CredentialContext } from "../../util/GoogleCredentialsProvider";
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

export function useConnection<TConnection extends Connection>(
  connType: { new (c: HubConnection): TConnection },
  endpoint: string,
) {
  const [credentials] = useContext(CredentialContext);
  const [connection, setConnection] = useState<TConnection>();

  useEffect(() => {
    if (!credentials) return;
    if (connection) return;

    const c = new HubConnectionBuilder()
      .withUrl(`${apiBase}${endpoint}`, {
        accessTokenFactory: () => credentials,
      })
      .build();
    const conn = new connType(c);
    conn.start();
    setConnection(conn);
  }, [connection, credentials, connType, endpoint]);

  return connection;
}
