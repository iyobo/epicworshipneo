import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
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
                <Link to="/">
                  <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: album"/>
                  Productions
                </Link>
              </li>
              <li>
                <Link to="/elements">
                  <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: thumbnails"/>
                  Elements
                </Link>
              </li>
              <li>
                <Link to="/live">
                  <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: star"/>
                  Live
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: settings"/>
                  Settings
                </Link>
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
