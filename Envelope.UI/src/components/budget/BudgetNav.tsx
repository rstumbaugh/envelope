import { useContext, useState } from "react";
import { BudgetContext } from "../../pages/Budget";
import { Button, Menu, Space } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import _ from "lodash";
import { Link, useLoaderData } from "react-router-dom";
import { LoaderData } from "../../main";
import { Account, defaultAccount } from "../../types/budget";
import styled from "styled-components";
import AddAccountModal from "./AddAccountModal";

const MenuWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
`;

const ButtonWrap = styled.div`
  margin-left: 8px;
`;

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
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);

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
    <MenuWrap>
      <Menu
        mode="inline"
        defaultSelectedKeys={[selectedMenuItem]}
        style={{ height: "100%" }}
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

      <ButtonWrap>
        <Button>Add account</Button>
        <AddAccountModal
          open={accountModalOpen}
          onAdd={(a) => setAccountModalOpen(false)}
          onClose={() => setAccountModalOpen(false)}
        />
      </ButtonWrap>
    </MenuWrap>
  );
}
