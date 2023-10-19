import moment from "moment";
import { Transaction, getNewTransaction } from "../../types/budget";
import EditableTable from "../../util/EditableTable";
import { useConnections } from "../../util/ConnectionProvider";
import { Space, Button } from "antd";
import { useLoaderData } from "react-router-dom";
import { LoaderData } from "../../main";
import { DeleteOutlined } from "@ant-design/icons";

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable(props: Props) {
  const { accountId } = useLoaderData() as LoaderData;
  const { transactionConnection } = useConnections();

  function onAdd() {
    transactionConnection?.addTransaction(getNewTransaction(accountId));
  }

  function onDelete(t: Transaction) {
    transactionConnection?.deleteTransaction(t);
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={() => onAdd()}>
        Add new transaction
      </Button>
      <EditableTable
        data={props.transactions}
        onEdit={(t) => transactionConnection?.editTransaction(t)}
        columns={[
          {
            title: "Date",
            editable: true,
            dataIndex: "timestamp",
            dataType: "date",
            sorter: (a, b) => (a.timestamp < b.timestamp ? -1 : 1),
            defaultSortOrder: "descend",
            render: (value: Date) => moment(value).format("MM/DD/YYYY"),
          },
          {
            title: "Payee",
            editable: true,
            dataIndex: "payee",
            sorter: (a, b) => (a.payee < b.payee ? -1 : 1),
            dataType: "string",
          },
          {
            title: "Notes",
            editable: true,
            dataIndex: "notes",
            dataType: "string",
          },
          {
            title: "Outflow",
            editable: true,
            dataIndex: "amount",
            dataType: "number",
            isNegative: true,
            sorter: (a, b) => a.amount - b.amount,
            render: (value: number) => (value < 0 ? Math.abs(value) : ""),
          },
          {
            title: "Inflow",
            editable: true,
            dataIndex: "amount",
            dataType: "number",
            sorter: (a, b) => b.amount - a.amount,

            render: (value: number) => (value < 0 ? "" : Math.abs(value)),
          },
          {
            title: "",
            dataIndex: "",
            editable: false,
            render: (t: Transaction) => (
              <Button onClick={() => onDelete(t)} size="small" icon={<DeleteOutlined />} />
            ),
          },
        ]}
      />
    </Space>
  );
}
