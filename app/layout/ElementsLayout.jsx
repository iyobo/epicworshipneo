import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { NavLink, Route, Switch } from "react-router-dom";
import SongsPage from "../pages/elements/SongsPage";
import ScripturePage from "../pages/elements/ScripturePage";
import MediaPage from "../pages/elements/MediaPage";
import BackgroundsPage from "../pages/elements/BackgroundsPage";
import AnnouncementsPage from "../pages/elements/AnnouncementsPage";
import PresentationsPage from "../pages/elements/PresentationsPage";

@inject("store")
@observer
export default class ElementsLayout extends Component {
  render() {
    return (
      <div className='uk-animation-slide-right-small'>

        <ul className="uk-subnav uk-subnav-pill uk-animation-slide-top-small">
          <li><NavLink exact to="/elements"><i className='fa fa-music'/> Songs</NavLink></li>
          <li><NavLink to="/elements/scripture"><i className='fa fa-bible'/> Scripture</NavLink></li>
          <li><NavLink to="/elements/media"><i className='fa fa-play-circle'/> Media</NavLink></li>
          <li><NavLink to="/elements/backgrounds"><i className='fa fa-image'/> Backgrounds</NavLink></li>
          <li><NavLink to="/elements/announcements"><i className='fa fa-bullhorn'/> Announcements</NavLink></li>
          <li><NavLink to="/elements/presentations"><i className='fa fa-magic'/> Presentations</NavLink></li>

        </ul>

        <div className='elementsBody'>
          <Switch>
            <Route exact path="/elements" component={SongsPage}/>
            <Route exact path="/elements/scripture" component={ScripturePage}/>
            <Route exact path="/elements/media" component={MediaPage}/>
            <Route exact path="/elements/backgrounds" component={BackgroundsPage}/>
            <Route exact path="/elements/announcements" component={AnnouncementsPage}/>
            <Route exact path="/elements/presentations" component={PresentationsPage}/>

          </Switch>
        </div>

      </div>
    );
  }
}
