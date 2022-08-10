import {
  HomeOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, UngroupOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";

import '../css/App.css';

const { Header, Sider, Content } = Layout;

const routes = [{
  label: 'home',
  path: 'home',
  icon: <HomeOutlined />,
}, {
  label: 'demo',
  path: '',
  icon: <UngroupOutlined />,
  children: [{
    label: 'mqtt',
    path: 'mqtt',
  }]
}, {
  label: 'about',
  path: 'about',
  icon: <ReadOutlined />
}];

function createMenus(path, routes, onClick) {
  return routes.map((route) => {
    return {
      key: route.label,
      icon: route.icon,
      label: route.label,
      onClick: route.children ? undefined : onClick(path, route),
      children: route.children ? createMenus(path + (route.path.length > 0 ? '/' : '') + route.path, route.children, onClick) : undefined,
    };
  });
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  let navigate = useNavigate();

  const items = createMenus('', routes, (path, route) => {
    return (a) => {
      console.log(path, route);
      navigate(path + '/' + route.path);
    }
  });
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['home']}
          items={items}
        />
      </Sider>
      <Layout className="site-layout" style={{
        height: '100vh',
      }}>
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '12px 8px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
