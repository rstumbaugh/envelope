import { useContext } from "react";
import { BudgetContext } from "../../pages/Budget";
import { Menu } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import _ from "lodash";
import { Link, useLoaderData } from "react-router-dom";
import { LoaderData } from "../../main";
import { Account } from "../../types/budget";

function getAccountItem(budgetId: string, account: Account): MenuItemType {
  const { id, name, balance } = account;

  return {
    label: (
      <Link to={`/budget/${budgetId}/account/${id}`}>
        {name} (${balance})
      </Link>
    ),
    key: id,
  };
}

export default function BudgetNav() {
  const { budgetId, accountId } = useLoaderData() as LoaderData;

  const budget = useContext(BudgetContext);

  const selectedMenuItem = accountId || budgetId;

  const { account, loan, tracking } = budget.accounts.reduce(
    (acc, account) => {
      switch (account.type) {
        case "CashAccount":
        case "CreditCard":
          acc.account.push(account);
          break;
        case "Loan":
          acc.loan.push(account);
          break;
        case "Tracking":
          acc.tracking.push(account);
          break;
      }

      return acc;
    },
    { account: [] as Account[], loan: [] as Account[], tracking: [] as Account[] },
  );

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[selectedMenuItem]}
      items={[
        {
          label: <Link to={`/budget/${budgetId}`}>{budget.name}</Link>,
          key: budget.id,
        },
        {
          label: `Accounts (${_.sum(account.map((a) => a.balance))})`,
          key: "accounts",
          type: "group",
          children: account.map((a) => getAccountItem(budgetId, a)),
        },
        {
          label: `Loans (${_.sum(loan.map((a) => a.balance))})`,
          key: "loans",
          type: "group",
          children: loan.map((a) => getAccountItem(budgetId, a)),
        },
        {
          label: `Investment (${_.sum(tracking.map((a) => a.balance))})`,
          key: "tracking",
          type: "group",
          children: tracking.map((a) => getAccountItem(budgetId, a)),
        },
      ]}
    />
  );
}
