import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class LivePage extends Component {
  render() {
    return (
      <div className='uk-animation-slide-right-small'>
        <h2>Live</h2>

        <button className="uk-button uk-button-primary uk-button-large"
                onClick={() => this.props.store.screenStore.testText()}>Test Projector Text
        </button><br/>
        <button className="uk-button uk-button-primary uk-button-large"
                onClick={() => this.props.store.screenStore.testStaticBackground1()}>Test Projector static 1
        </button><br/>
        <button className="uk-button uk-button-primary uk-button-large"
                onClick={() => this.props.store.screenStore.testStaticBackground2()}>Test Projector static 2
        </button><br/>
        <button className="uk-button uk-button-primary uk-button-large"
                onClick={() => this.props.store.screenStore.testMotionBackground1()}>Test Projector motion 1
        </button><br/>
        <button className="uk-button uk-button-primary uk-button-large"
                onClick={() => this.props.store.screenStore.testMotionBackground2()}>Test Projector motion 2
        </button><br/>
      </div>
    );
  }
}
