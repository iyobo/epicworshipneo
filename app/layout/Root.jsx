// @flow
import React, { Component, Fragment } from "react";

import { Provider } from "mobx-react";
import appStore from "../data/stores/AppStore";
import SettingsLayout from "./SettingsLayout";
import DashboardLayout from "./DashboardLayout";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Loading from "react-loading-bar";
import "react-loading-bar/dist/index.css";


export default class Root extends Component {

  componentDidCatch(error) {
    toast.error({ title: "Oops", message: error.message });
  }


  render() {
    return (
      <Provider store={appStore}>
        <Fragment>
          <Loading
            // show={this.props.store.isBusy}
            show={true}
            color="red"
          />
          <BrowserRouter>
            <Switch>
              <Route path='' component={DashboardLayout}/>
            </Switch>
          </BrowserRouter>
        </Fragment>
      </Provider>
    );
  }
}
