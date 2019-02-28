import React, { Component } from "react";
import { Link, NavLink, Route, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react";
import ProductionPage from "../pages/productions/ProductionPage";
import ElementsLayout from "./ElementsLayout";
import LivePage from "../pages/LivePage";
import SettingsLayout from "./SettingsLayout";
import NewsPage from "../pages/NewsPage";
import { T } from "../../i18n/i18n";


@inject("store")
@observer
export default class DashboardLayout extends Component {

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    this.setState(error);
  }


  render() {

    const nav = (
      <nav className="uk-navbar-container uk-margin uk-navbar mainnav">
        <div className="uk-navbar-left">
          <Link className="uk-navbar-item uk-logo" to="/">EpicWorship</Link>

          <ul className="uk-navbar-nav">
            <li>
              <NavLink exact to="/productions">
                <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: album"/>
                <T name='menu_productions'/>
              </NavLink>
            </li>
            <li>
              <NavLink to="/elements">
                <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: thumbnails"/>
                <T name='menu_elements'/>
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/live">
                <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: star"/>
                <T name='menu_live'/>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings">
                <span className="uk-icon uk-margin-small-right" href="#" uk-icon="icon: settings"/>
                <T name='menu_settings'/>
              </NavLink>
            </li>

          </ul>
        </div>

        <div className="uk-navbar-right">
          <div className='pad10'>
            <span uk-icon="icon: rss"/>
            <T name='menu_nowLive'/>: <Link
            to='/productions'>{this.props.store.productionStore.liveProduction ? this.props.store.productionStore.liveProduction.name :
            <i>None</i>}</Link>
          </div>

          <ul className="uk-navbar-nav">

          </ul>
        </div>
      </nav>
    );

    const body = (
      <div className='dashboardBody'>
        <Switch>
          <Route path='/elements' component={ElementsLayout}/>
          <Route path='/live' component={LivePage}/>
          <Route path='/settings' component={SettingsLayout}/>
          <Route path='/productions' component={ProductionPage}/>
          <Route exact path='' component={NewsPage}/>
        </Switch>
      </div>
    );

    return (
      <div className='dashboardLayout uk-animation-slide-left-small'>
        {nav}
        {this.state.error?<div>Oops, something went wrong: {this.state.error.message}</div>: body}
      </div>
    );
  }
}
