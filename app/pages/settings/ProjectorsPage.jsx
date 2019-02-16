import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { T } from "../../../i18n/i18n";

@inject("store")
@observer
export default class ProjectorsPage extends Component {
  render() {
    return (
      <div className='uk-animation-slide-left-small'>
        <h3><T name='menu_projectors'/></h3>
      </div>
    );
  }
}
