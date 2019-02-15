import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link, NavLink, Route, Switch } from "react-router-dom";
import SongsPage from "../pages/SongsPage";
import ScripturePage from "../pages/ScripturePage";
import VideoPage from "../pages/VideoPage";
import VideoBackgroundPage from "../pages/VideoBackgroundPage";
import ImagePage from "../pages/ImagePage";
import ImageBackgroundPage from "../pages/ImageBackgroundPage";
import AudioPage from "../pages/AudioPage";

@inject("store")
@observer
export default class ElementsLayout extends Component {
  render() {
    return (
      <div className='uk-animation-slide-right-small'>

        <ul className="uk-subnav uk-subnav-pill">
          <li><NavLink exact to="/elements">Songs</NavLink></li>
          <li><NavLink to="/elements/scripture">Scripture</NavLink></li>
          <li><NavLink to="/elements/video">Video</NavLink></li>
          <li><NavLink to="/elements/videobg">Video Background</NavLink></li>
          <li><NavLink to="/elements/image">Image</NavLink></li>
          <li><NavLink to="/elements/imagebg">Image Background</NavLink></li>
          <li><NavLink to="/elements/audio">Audio</NavLink></li>
        </ul>

        <Switch>
          <Route exact to="/elements" component={SongsPage} />
          <Route to="/elements/scripture" component={ScripturePage} />
          <Route to="/elements/video" component={VideoPage} />
          <Route to="/elements/videobg" component={VideoBackgroundPage} />
          <Route to="/elements/image" component={ImagePage} />
          <Route to="/elements/imagebg" component={ImageBackgroundPage} />
          <Route to="/elements/audio" component={AudioPage} />
        </Switch>

      </div>
    );
  }
}
