import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class MigrationsPage extends Component {
  render() {
    return (
      <div className='uk-animation-slide-left-small'>

      </div>
    );
  }
}
