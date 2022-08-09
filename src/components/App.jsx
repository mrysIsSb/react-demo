import {
  HomeOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate, useRoutes } from "react-router-dom";
import Hello from '../Hello';

import './App.css';

const { Header, Sider, Content, Footer } = Layout;


const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];





function createMenus(path, routes, onClick) {
  return routes.map((route) => {
    return {
      key: route.label,
      icon: route.icon,
      label: route.label,
      onClick: route.children ? undefined : onClick(path, route),
      children: route.children ? createMenus(path + '/' + route.label, route.children, onClick) : undefined,
    };
  });
}

const App = ({ routes }) => {
  const [collapsed, setCollapsed] = useState(false);
  let navigate = useNavigate();

  // let r = createRoutes('', routes);
  // console.log(r);
  // let r1 = useRoutes(r);
  // console.log(r1);



  const items = createMenus('', routes, (path, route) => {
    return (a) => {
      console.log(a);
      console.log('path', path + '/' + route.label);
      navigate(path + '/' + route.label);
    }
  });
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['首页']}
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
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
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
          <Footer >footer</Footer>
        </Content>
      </Layout>
    </Layout>
  );
};
/* const App = () => {
  const [openKeys, setOpenKeys] = useState(['sub1']);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const [collapsed, setCollapsed] = useState(false);
  return (

    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      style={{
        width: 256,
      }}
      items={items}
    />
  );
}; */

export default App;
