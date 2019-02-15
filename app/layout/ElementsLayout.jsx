import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

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

      </div>
    );
  }
}
