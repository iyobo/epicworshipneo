import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class ProductionPage extends Component {
  render() {
    return (
      <div className='uk-animation-slide-right-small'>
          <h2>Productions</h2>
      </div>
    );
  }
}
