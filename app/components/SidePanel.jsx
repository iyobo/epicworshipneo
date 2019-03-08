import React, { Component } from "react";
import { inject, observer } from "mobx-react";

type Props = {}

@inject("store")
@observer
export default class SidePanel extends Component<Props> {
  render() {
    return (
      <div className=''>

      </div>
    );
  }
}
