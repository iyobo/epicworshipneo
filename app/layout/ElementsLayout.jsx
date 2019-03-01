import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { NavLink, Route, Switch } from "react-router-dom";
import SongsPage from "../pages/elements/SongsPage";
import ScripturePage from "../pages/elements/ScripturePage";
import MediaPage from "../pages/elements/MediaPage";
import BackgroundsPage from "../pages/elements/BackgroundsPage";
import AnnouncementsPage from "../pages/elements/AnnouncementsPage";
import PresentationsPage from "../pages/elements/PresentationsPage";
import { T } from "../../i18n/i18n";

@inject("store")
@observer
export default class ElementsLayout extends Component {
  render() {
    return (
      <div className='uk-animation-slide-right-small'>

        <ul className="uk-subnav uk-subnav-pill uk-animation-slide-top-small">
          <li><NavLink exact to="/elements"><i className='fa fa-music'/> <T name='menu_songs'/></NavLink></li>
          <li><NavLink to="/elements/scripture"><i className='fa fa-bible'/> <T name='menu_scripture'/></NavLink></li>
          <li><NavLink to="/elements/media"><i className='fa fa-play-circle'/> <T name='menu_media'/></NavLink></li>
          <li><NavLink to="/elements/backgrounds"><i className='fa fa-image'/> <T name='menu_backgrounds'/></NavLink></li>
          <li><NavLink to="/elements/announcements"><i className='fa fa-bullhorn'/> <T name='menu_announcements'/></NavLink></li>
          <li><NavLink to="/elements/presentations"><i className='fa fa-magic'/> <T name='menu_presentations'/></NavLink></li>

        </ul>
        {/*Order of routes is important*/}
        <div className='elementsBody'>
          <Switch>
            <Route exact path="/elements" component={SongsPage}/>

            <Route exact path="/elements/songs/:elementId" component={SongsPage}/>
            <Route path="/elements/songs" component={SongsPage}/>

            <Route exact path="/elements/scripture" component={ScripturePage}/>

            <Route exact path="/elements/media/:elementId" component={MediaPage}/>
            <Route path="/elements/media" component={MediaPage}/>

            <Route exact path="/elements/backgrounds/:elementId" component={BackgroundsPage}/>
            <Route path="/elements/backgrounds" component={BackgroundsPage}/>

            <Route exact path="/elements/announcements/:elementId" component={AnnouncementsPage}/>
            <Route path="/elements/announcements" component={AnnouncementsPage}/>

            <Route exact path="/elements/presentations/:elementId" component={PresentationsPage}/>
            <Route path="/elements/presentations" component={PresentationsPage}/>

          </Switch>
        </div>

      </div>
    );
  }
}
