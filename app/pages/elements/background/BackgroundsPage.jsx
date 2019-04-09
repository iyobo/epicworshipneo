import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import BackgroundsComponent from "./BackgroundsComponent";



@inject("store")
@observer
export default class BackgroundsPage extends Component {

  constructor(props) {
    super(props);
  }

  getSelectedId() {
    return this.props.match.params.id;
  }

  render() {

    return (
      <BackgroundsComponent selectedId={this.getSelectedId()}/>
    );
  }
}
