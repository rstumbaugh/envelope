import { Col, Row } from "antd";
import { useLoaderData } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { LoaderData } from "../../main";
import { useContext, useEffect, useState } from "react";
import { Transaction } from "../../types/budget";
import TransactionTable from "./TransactionTable";
import { useConnections } from "../../util/ConnectionProvider";
import { StoreContext } from "../../store/store";

export default function Account() {
  const { accountId } = useLoaderData() as LoaderData;
  const { byAccountId } = useContext(StoreContext);

  console.log(byAccountId);

  return (
    <Content style={{ padding: 8 }}>
      <Row>
        <Col span={24}>
          {/* <EditableTable /> */}
          <TransactionTable transactions={byAccountId[accountId]} />
        </Col>
      </Row>
    </Content>
  );
}
