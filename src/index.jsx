import 'antd/dist/antd.css';
import React from 'react';
import { render } from 'react-dom';
// import { Router } from 'react-router';
import {
  BrowserRouter as Router, Route,
  // HashRouter as Router,
  Routes, useRoutes
} from "react-router-dom";
import NotFound from './common/NotFound';
import App from './views/App';
import Home from './views/Home';
import MqttDemo from './views/MqttDemo';
import About from './views/About';
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
 */


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
      <Route path="/" element={<App />} >
        <Route path="home" element={<Home />} />
        <Route path="mqtt" element={<MqttDemo />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
), document.getElementsByTagName('body')[0]);



