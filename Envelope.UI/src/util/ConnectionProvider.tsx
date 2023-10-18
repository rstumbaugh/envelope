import { createContext, useContext, useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalR";
import { apiBase } from "../api/api";
import { BudgetConnection } from "../api/connection/budgetConnection";
import { Connection } from "../api/connection/connections";
import { TransactionConnection } from "../api/connection/transactionConnection";
import { CredentialContext } from "./GoogleCredentialsProvider";

function buildConnection<TConnection extends Connection>(
  connType: { new (c: HubConnection): TConnection },
  credentials: string,
  endpoint: string,
) {
  const c = new HubConnectionBuilder()
    .withUrl(`${apiBase}${endpoint}`, {
      accessTokenFactory: () => credentials,
    })
    .build();
  const conn = new connType(c);
  conn.start();
  return conn;
}

type ConnectionContextType = {
  budgetConnection: BudgetConnection | undefined;
  transactionConnection: TransactionConnection | undefined;
};

const defaultContext: ConnectionContextType = {
  budgetConnection: undefined,
  transactionConnection: undefined,
};

const ConnectionContext = createContext<ConnectionContextType>(defaultContext);

export default function ConnectionContextProvider(props: { children: any }) {
  const [credentials] = useContext(CredentialContext);

  const [ctx, setCtx] = useState<ConnectionContextType>(defaultContext);

  useEffect(() => {
    if (!credentials) return;
    if (ctx.budgetConnection) return;

    setCtx({
      budgetConnection: buildConnection(BudgetConnection, credentials, "/hubBudget"),
      transactionConnection: buildConnection(TransactionConnection, credentials, "/hubTransaction"),
    });
  }, [credentials, ctx]);

  return <ConnectionContext.Provider value={ctx}> {props.children}</ConnectionContext.Provider>;
}

export const useConnections = () => useContext(ConnectionContext);
