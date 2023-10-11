import { Outlet, useLoaderData } from "react-router-dom";
import { Budget, defaultBudget } from "../types/budget";
import { createContext, useEffect, useState } from "react";
import { useBudgetConnection } from "../api/connections";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import _ from "lodash";
import BudgetNav from "../components/budget/BudgetNav";
import { Content } from "antd/es/layout/layout";
import { LoaderData } from "../main";

export const BudgetContext = createContext<Budget>(defaultBudget);

export default function BudgetPage() {
  const { budgetId: id } = useLoaderData() as LoaderData;
  const [budget, setBudget] = useState<Budget>(defaultBudget);

  const connection = useBudgetConnection();
  useEffect(() => {
    connection
      ?.getBudget(id)
      .then((budget) => {
        setBudget(budget);
      })
      .catch((err) => console.error("error getting budget", err));
  }, [id, connection]);

  return (
    <BudgetContext.Provider value={budget}>
      <Layout>
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
