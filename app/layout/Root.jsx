// @flow
import React, { Component } from "react";

import { Provider } from "mobx-react";
import AppStore from "../data/AppStore";
import SettingsLayout from "./SettingsLayout";
import DashboardLayout from "./DashboardLayout";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const store = new AppStore();

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path='/settings' component={SettingsLayout}/>
            <Route path='/' component={DashboardLayout}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
