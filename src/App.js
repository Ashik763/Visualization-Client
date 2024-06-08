
import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import SectorIntensity from './components/SectorIntensity/SectorIntensity';
import PieChartInPercentage from './components/PieChartInPercentage/PieChartInPercentage';
import MultiLineChart from './components/MultiLineChart/MultiLineChart';
// import SectorIntensity from './components/SectorIntensity/SectorIntensity';
const { Header, Content, Sider } = Layout;
const items1 = ['1'].map((key) => ({
  key,
  label: `Dashboard`,
}));
const items2 = [ LaptopOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `Menu`,
    icon: React.createElement(icon),
    label: `Menu`,
    children: new Array(1).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `Items`,
      };
    }),
  };
});

const App = () => {
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
 
 
  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['Dashboard']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Menu</Breadcrumb.Item>
            <Breadcrumb.Item>Items</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <SectorIntensity></SectorIntensity>
            <br/>

            <PieChartInPercentage></PieChartInPercentage>

            <MultiLineChart></MultiLineChart>



          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;