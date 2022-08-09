import React from 'react';
import { render } from 'react-dom';
import 'antd/dist/antd.css';
// import { Router } from 'react-router';
import {
  HomeOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import {
  BrowserRouter as Router,
  // HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link, useParams, Outlet, useRoutes
} from "react-router-dom";
import { routeConfig } from './routes'
import NotFound from './common/NotFound';
import App from './components/App';
import Hello from './Hello';
// import {BrowserRouter as Router, browserHistory} from 'react-router-dom'

/* 
function Invoices() {
  return <h1>Invoices</h1>;
}

function Dashboard() {
  return <h1>Dashboard</h1>;
}

function SentInvoices() {
  return <h1>Sent Invoices</h1>;
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  let navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to the app!</h1>
      <nav>
        <button onClick={() => {
          navigate("/invoices");
        }}>
          hello
        </button>
        <Link to="dashboard">Dashboard</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div >
  );
}

render((
  <Router >
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
), document.getElementsByTagName('body')[0]); */

const routes = [{
  label: 'home',
  icon: <HomeOutlined />,
  element: <Hello />,
}, {
  label: 'about',
  icon: <HomeOutlined />,
  children: [{
    label: 'about1',
    icon: <HomeOutlined />,
    element: <Hello />,
  }],
}];
function createRoutes(path, routes) {
  return routes.map((route) => {
    return {
      path: route.label,
      element: route.element,
      children: route.children ? createRoutes(route.label, route.children) : undefined,
    };
  });
}

function InitRoutes() {
  return useRoutes(createRoutes('', routes));
}

render((
  <Router>
    <Routes>
      <Route path="/" element={<App routes={routes} />} >
        <Route path="home" element={<Hello />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
), document.getElementsByTagName('body')[0]);



