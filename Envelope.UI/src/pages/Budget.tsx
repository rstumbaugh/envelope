import { Outlet, useLoaderData } from "react-router-dom";
import { Budget, defaultBudget } from "../types/budget";
import { createContext, useEffect, useState } from "react";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import _ from "lodash";
import BudgetNav from "../components/budget/BudgetNav";
import { Content } from "antd/es/layout/layout";
import { LoaderData } from "../main";
import { useConnections } from "../util/ConnectionProvider";

export const BudgetContext = createContext<Budget>(defaultBudget);

export default function BudgetPage() {
  const { budgetId: id } = useLoaderData() as LoaderData;
  const [budget, setBudget] = useState<Budget>(defaultBudget);

  const { budgetConnection } = useConnections();

  useEffect(() => {
    budgetConnection
      ?.getBudget(id)
      .then((budget) => {
        setBudget(budget);
      })
      .catch((err) => console.error("error getting budget", err));
  }, [id, budgetConnection]);

  return (
    <BudgetContext.Provider value={budget}>
      <Layout style={{ height: "100%" }}>
        <Sider>
          <BudgetNav />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </BudgetContext.Provider>
  );
}
