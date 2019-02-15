import React, { Component } from "react";
import { Link, NavLink, Route, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react/index";
import ProjectorsPage from "../pages/settings/ProjectorsPage";
import CountdownPage from "../pages/settings/CountdownPage";
import BibleTranslationsPage from "../pages/settings/BibleTranslationsPage";
import MigrationsPage from "../pages/settings/MigrationsPage";

@inject('store')
@observer
export default class SettingsLayout extends Component {
  render() {
    return (
      <div className='settingsLayout uk-animation-slide-right-small'>
        <ul className="uk-subnav uk-subnav-pill">
          <li><NavLink exact to="/settings">Projectors</NavLink></li>
          <li><NavLink to="/settings/countdown">Countdown</NavLink></li>
          <li><NavLink to="/settings/bible">Bible Translations</NavLink></li>
          <li><NavLink to="/settings/migrations">Migrations</NavLink></li>
        </ul>

        <Switch>
          <Route exact to="/elements" component={ProjectorsPage} />
          <Route to="/elements/countdown" component={CountdownPage} />
          <Route to="/elements/bible" component={BibleTranslationsPage} />
          <Route to="/elements/migrations" component={MigrationsPage} />
        </Switch>

      </div>
    );
  }
}
