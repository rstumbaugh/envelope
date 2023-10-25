import { useContext } from "react";
import { Budget, Category, MonthlyAssignments, Transaction } from "../../types/budget";
import { StoreContext } from "../../store/store";
import { Table } from "antd";
import { GroupedCategoryViewModel, MonthlyDataContext } from "./MonthlyBudget";
import _, { Dictionary } from "lodash";
import { BudgetContext } from "../../pages/Budget";

interface TableData {
  key: string;
  categoryName: string;
  assigned: number;
  spent: number;
  available: number;
}

function createTableData(
  assignments: MonthlyAssignments,
  group: GroupedCategoryViewModel,
  transactions: Dictionary<Transaction[]>,
): TableData[] {
  return group.categories.map((c) => {
    const ts = transactions[c.id] || [];

    const assigned = assignments.categoryAssigned[c.id] || 0;
    const spent = _.sumBy(ts, (t) => t.amount);
    return {
      key: c.id,
      categoryName: c.name,
      assigned,
      spent,
      available: assigned - spent,
    };
  });
}

interface Props {
  groupedCategories: GroupedCategoryViewModel;
}

export default function CategoryGroupBudgetTable(props: Props) {
  const { groupedCategories } = props;
  const { currAssignments, transactionsByCategory } = useContext(MonthlyDataContext);

  const data = createTableData(currAssignments, groupedCategories, transactionsByCategory);

  return (
    <Table
      bordered
      dataSource={data}
      columns={[
        {
          title: "Category",
          dataIndex: "categoryName",
        },
        {
          title: "Assigned",
          dataIndex: "assigned",
        },
        {
          title: "Spent",
          dataIndex: "spent",
        },
        {
          title: "Available",
          dataIndex: "available",
        },
      ]}
      virtual={true}
      scroll={{ x: 1, y: "100vh" }}
      pagination={false}
      size="small"
    />
  );
}
