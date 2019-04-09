import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import MediaComponent from "./MediaComponent";


@inject("store")
@observer
export default class MediaPage extends Component {

  constructor(props) {
    super(props);
  }

  getSelectedId() {
    return this.props.match.params.id;
  }

  render() {

    return (
      <MediaComponent selectedId={this.getSelectedId()}/>
    );
  }
}
