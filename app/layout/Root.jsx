// @flow
import React, { Component } from "react";

import { Provider } from "mobx-react";
import appStore from "../data/AppStore";
import SettingsLayout from "./SettingsLayout";
import DashboardLayout from "./DashboardLayout";
import { BrowserRouter, Route, Switch } from "react-router-dom";


export default class Root extends Component {

  render() {
    return (
      <Provider store={appStore}>
        <BrowserRouter>
          <Switch>
            <Route path='' component={DashboardLayout}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
