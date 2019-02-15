import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link, Route, Switch } from "react-router-dom";
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
          <li className="uk-active"><Link to="/elements/songs">Songs</Link></li>
          <li><Link to="/elements/scripture">Scripture</Link></li>
          <li><Link to="/elements/video">Video</Link></li>
          <li><Link to="/elements/videobg">Video Background</Link></li>
          <li><Link to="/elements/image">Image</Link></li>
          <li><Link to="/elements/imagebg">Image Background</Link></li>
          <li><Link to="/elements/audio">Audio</Link></li>
        </ul>

        <Switch>
          <Route to="/elements/songs" component={SongsPage} />
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
