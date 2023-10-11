import { ConfigProvider, Layout, theme } from "antd";
import styled from "styled-components";
import { Content, Header as AntHeader } from "antd/es/layout/layout";
import AntTitle from "antd/es/typography/Title";
import { Link, Outlet } from "react-router-dom";

const Header = styled(AntHeader)`
  height: auto;
`;

const Title = styled(AntTitle)`
  margin: 0.5em;
`;

const TitleLink = styled(Link)`
  color: white !important;
`;

function App() {
  console.log("top level render");
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout>
        <Header>
          <Title level={2}>
            <TitleLink to="/">Envelope</TitleLink>
          </Title>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
