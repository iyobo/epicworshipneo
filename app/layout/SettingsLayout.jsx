import React, { Component } from "react";
import { Link, NavLink, Route, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react/index";
import ProjectorsPage from "../pages/settings/ProjectorsPage";
import CountdownPage from "../pages/settings/CountdownPage";
import BibleVersionsPage from "../pages/settings/BibleTranslationsPage";
import MigrationsPage from "../pages/settings/MigrationsPage";
import LanguagePage from "../pages/settings/LanguagePage";

@inject('store')
@observer
export default class SettingsLayout extends Component {
  render() {
    return (
      <div className='settingsLayout uk-animation-slide-right-small'>
        <ul className="uk-subnav uk-subnav-pill uk-animation-slide-top-small">
          <li><NavLink exact to="/settings"><i className='fa fa-tv'/> Projectors</NavLink></li>
          <li><NavLink to="/settings/countdown"><i className='fa fa-clock'/> Countdown</NavLink></li>
          <li><NavLink to="/settings/bible"><i className='fa fa-bible'/> Bible Versions</NavLink></li>
          <li><NavLink to="/settings/migrations"><i className='fa fa-exchange-alt'/> Migrations</NavLink></li>
          <li><NavLink to="/settings/languages"><i className='fa fa-language'/> Language</NavLink></li>
        </ul>

        <Switch>
          <Route exact to="/settings" component={ProjectorsPage} />
          <Route to="/settings/countdown" component={CountdownPage} />
          <Route to="/settings/bible" component={BibleVersionsPage} />
          <Route to="/settings/migrations" component={MigrationsPage} />
          <Route to="/settings/languages" component={LanguagePage} />
        </Switch>

      </div>
    );
  }
}
