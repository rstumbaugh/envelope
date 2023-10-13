import { Col, Row } from "antd";
import { useLoaderData } from "react-router-dom";
import EditableTable from "../../util/EditableTable";
import { Content } from "antd/es/layout/layout";
import { LoaderData } from "../../main";
import { useTransactionConnection } from "../../api/connection/transactionConnection";
import { useEffect, useState } from "react";
import { Transaction } from "../../types/budget";
import TransactionTable from "./TransactionTable";

export default function Account() {
  const { accountId } = useLoaderData() as LoaderData;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const connection = useTransactionConnection();
  useEffect(() => {
    if (!connection) return;
    connection.registerCallback(() => setTransactions(connection.accountTransactions[accountId]));
    connection.requestTransactions({ accountId });
  }, [accountId, connection]);

  return (
    <Content style={{ padding: 8 }}>
      <Row>
        <Col span={24}>
          {/* <EditableTable /> */}
          <TransactionTable transactions={transactions} />
        </Col>
      </Row>
    </Content>
  );
}
