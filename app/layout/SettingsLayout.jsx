import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
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
          <li className="uk-active"><Link to="/settings/projectors">Projectors</Link></li>
          <li><Link to="/settings/countdown">Countdown</Link></li>
          <li><Link to="/settings/bible">Bible Translations</Link></li>
          <li><Link to="/settings/migrations">Migrations</Link></li>
        </ul>

        <Switch>
          <Route to="/elements/projectors" component={ProjectorsPage} />
          <Route to="/elements/countdown" component={CountdownPage} />
          <Route to="/elements/bible" component={BibleTranslationsPage} />
          <Route to="/elements/migrations" component={MigrationsPage} />
        </Switch>

      </div>
    );
  }
}
