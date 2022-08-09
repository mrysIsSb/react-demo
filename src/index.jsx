import React from 'react';
import { render } from 'react-dom';
// import { Router } from 'react-router';
import {
  BrowserRouter as Router,
  // HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link, useParams, Outlet
} from "react-router-dom";
import { routeConfig } from './routes'
import NotFound from './common/NotFound';
import Hello from './Hello';
// import {BrowserRouter as Router, browserHistory} from 'react-router-dom'


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
  return (
    <div>
      <h1>Welcome to the app!</h1>
      <nav>
        <Link to="invoices">Invoices</Link> |{" "}
        <Link to="dashboard">Dashboard</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
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
), document.getElementById("body"));

