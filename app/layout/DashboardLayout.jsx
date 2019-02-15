import React, { Component } from "react";
import { Link, NavLink, Route, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react";
import ProductionPage from "../pages/ProductionPage";
import ElementsLayout from "./ElementsLayout";
import LivePage from "../pages/LivePage";
import SettingsLayout from "./SettingsLayout";


@inject("store")
@observer
export default class DashboardLayout extends Component {
  render() {
    return (
      <div className='dashboardLayout uk-animation-slide-left-small'>

        <nav className="uk-navbar-container uk-margin uk-navbar">
          <div className="uk-navbar-left">
            <a className="uk-navbar-item uk-logo" href="#">EpicWorship</a>

            <ul className="uk-navbar-nav">
              <li>
                <NavLink exact to="/" >
                  <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: album"/>
                  Productions
                </NavLink>
              </li>
              <li>
                <NavLink to="/elements">
                  <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: thumbnails"/>
                  Elements
                </NavLink>
              </li>
              <li>
                <NavLink to="/live">
                  <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: star"/>
                  Live
                </NavLink>
              </li>
              <li>
                <NavLink to="/settings">
                  <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: settings"/>
                  Settings
                </NavLink>
              </li>

            </ul>
          </div>

          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">

            </ul>
          </div>
        </nav>

        <div className='dashboardBody'>
          <Switch>
            <Route path='/elements' component={ElementsLayout}/>
            <Route path='/live' component={LivePage}/>
            <Route path='/settings' component={SettingsLayout}/>
            <Route path='/' component={ProductionPage}/>
          </Switch>
        </div>


      </div>
    );
  }
}
