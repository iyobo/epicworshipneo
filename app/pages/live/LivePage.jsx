import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class LivePage extends Component {
  render() {
    return (
      <div className='uk-animation-slide-right-small'>
        <h2>Live</h2>

        <button className="uk-button uk-button-primary uk-button-large" onClick={()=>this.props.store.screenStore.testProjector()}>Test Projector</button>
      </div>
    );
  }
}
