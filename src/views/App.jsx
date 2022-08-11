import {
  HomeOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, UngroupOutlined,
  ReadOutlined, BellOutlined
} from '@ant-design/icons';
import { Layout, Menu, Badge } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";

import mqtt from '../js/mqttClient';

import '../css/App.css';

import { useDispatch, useSelector } from 'react-redux';
import { mqttSelector } from '../redux/mqttSlice';



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
  //mqtt
  const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Auth
    clientId: 'access-token',
    username: 'emqx_test',
    password: 'emqx_test',
    accessToken: 'access-token12341234123412334312',
  }
  mqtt.connect('ws://localhost:8883/mqtt', options);
  mqtt.subscribe('mqtt.hello');

  const count = useSelector(mqttSelector).msgs.length;
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
          <span onClick={
            () => navigate('/mqtt')
          } style={{
            float: 'right',
            lineHeight: 'inherit',
            marginRight: '32px',
          }}>
            <Badge count={count} size='small'>
              <BellOutlined style={
                {
                  fontSize: '20px',
                }
              } />
            </Badge>
          </span>
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
