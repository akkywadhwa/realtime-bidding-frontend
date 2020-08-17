import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './shared/pages/Login';
import Dashboard from './shared/pages/ContractorDashboard';
import TransporterDashboard from './shared/pages/TransporterDashboard';

const routing = (
  <Router>
    <Redirect exact from="/" to="/login" />
    <Route exact path="/login" component={Login} />
    <Route path="/contractor-dashboard" component={Dashboard} />
    <Route path="/transporter-dashboard" component={TransporterDashboard} />
  </Router>
);

ReactDOM.render(routing, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
