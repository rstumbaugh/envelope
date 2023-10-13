import moment from "moment";
import { Transaction } from "../../types/budget";
import EditableTable from "../../util/EditableTable";

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable(props: Props) {
  console.log(props.transactions);
  return (
    <EditableTable
      data={props.transactions}
      onEdit={(t) => console.log(t)}
      columns={[
        {
          title: "Date",
          editable: true,
          dataIndex: "timestamp",
          render: (value: Date) => moment(value).format("MM/DD/YYYY"),
        },
        {
          title: "Payee",
          editable: true,
          dataIndex: "payee",
        },
        {
          title: "Notes",
          editable: true,
          dataIndex: "notes",
        },
        {
          title: "Outflow",
          editable: true,
          dataIndex: "amount",
          render: (value: number) => (value < 0 ? Math.abs(value) : ""),
        },
        {
          title: "Inflow",
          editable: true,
          dataIndex: "amount",
          render: (value: number) => (value < 0 ? "" : Math.abs(value)),
        },
      ]}
    />
  );
}
