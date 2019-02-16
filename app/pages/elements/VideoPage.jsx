import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class VideoPage extends Component {
  render() {
    return (
      <div className='uk-animation-slide-left-small'>
        <h3>Videos</h3>
      </div>
    );
  }
}
