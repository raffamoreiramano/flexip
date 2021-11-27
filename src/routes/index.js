import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import NotFound from './Errors/NotFound';

import Signin from './Signin';
import Auth from './Auth';
import User from './User';

export default function Routes() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/admin/*" component={User} />
          <Route path="/auth" component={Auth} />
          <Route exact path="/" component={Signin} />

          <Route component={NotFound} />
        </Switch>
      </Router>
    </>
  );
}