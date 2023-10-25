import { Collapse, CollapseProps, Space } from "antd";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import MonthSelector from "./MonthSelector";
import { BudgetContext } from "../../pages/Budget";
import { Category, MonthlyAssignments, Transaction } from "../../types/budget";
import _, { Dictionary } from "lodash";
import { StoreContext } from "../../store/store";
import { filterTransactionsForMonth, fmt } from "../../util/monthlyBudgetHelper";
import CategoryGroupBudgetTable from "./CategoryGroupBudgetTable";

export interface GroupedCategoryViewModel {
  groupName: string;
  groupId: string;
  categories: Category[];
}

export interface MonthlyData {
  currAssignments: MonthlyAssignments;
  transactionsByCategory: Dictionary<Transaction[]>;
}

export const MonthlyDataContext = createContext<MonthlyData>({
  currAssignments: { categoryAssigned: {} },
  transactionsByCategory: {},
});

export default function MonthlyBudget() {
  const budget = useContext(BudgetContext);
  const { transactions } = useContext(StoreContext);

  const [currMonthString, setCurrMonthString] = useState<string>(moment().format(fmt));
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategoryViewModel[]>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<Dictionary<Transaction[]>>({});

  useEffect(() => {
    setGroupedCategories(
      _.entries(_.groupBy(budget.categories, (c) => c.groupId)).map(([groupId, cs]) => ({
        groupName: budget.categoryGroups.find((g) => g.id === groupId)?.name || groupId,
        groupId,
        categories: cs,
      })),
    );
  }, [budget]);

  useEffect(() => {
    const transactionsForMonth = filterTransactionsForMonth(transactions, currMonthString);
    setGroupedTransactions(_.groupBy(transactionsForMonth, (c) => c.categoryId));
  }, [transactions, currMonthString]);

  const collapseGroups: CollapseProps["items"] = groupedCategories.map((g) => ({
    key: g.groupId,
    label: g.groupName,
    children: <CategoryGroupBudgetTable key={g.groupId} groupedCategories={g} />,
  }));

  return (
    <MonthlyDataContext.Provider
      value={{
        currAssignments: budget.monthlyAssigned[currMonthString],
        transactionsByCategory: groupedTransactions,
      }}
    >
      <Space direction="vertical">
        <MonthSelector month={currMonthString} onChange={setCurrMonthString} />

        <Collapse items={collapseGroups} activeKey={groupedCategories.map((g) => g.groupId)} />
      </Space>
    </MonthlyDataContext.Provider>
  );
}
