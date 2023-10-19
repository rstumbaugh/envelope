import { Outlet, useLoaderData } from "react-router-dom";
import { Budget, defaultBudget } from "../types/budget";
import { createContext, useContext } from "react";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import _ from "lodash";
import BudgetNav from "../components/budget/BudgetNav";
import { Content } from "antd/es/layout/layout";
import { LoaderData } from "../main";
import { StoreContext } from "../store/store";

export const BudgetContext = createContext<Budget>(defaultBudget);

export default function BudgetPage() {
  const { budgetId } = useLoaderData() as LoaderData;

  const { budgets } = useContext(StoreContext);
  const budget = budgets.find((b) => b.id === budgetId) || defaultBudget;

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
