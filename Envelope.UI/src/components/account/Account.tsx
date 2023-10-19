import { Col, Row, Space } from "antd";
import { useLoaderData } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { LoaderData } from "../../main";
import { useContext } from "react";
import TransactionTable from "./TransactionTable";
import { StoreContext } from "../../store/store";

export default function Account() {
  const { accountId } = useLoaderData() as LoaderData;
  const { byAccountId } = useContext(StoreContext);

  return (
    <Content style={{ padding: 8 }}>
      <Row>
        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <TransactionTable transactions={byAccountId[accountId]} />
          </Space>
        </Col>
      </Row>
    </Content>
  );
}
