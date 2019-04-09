import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Modal from "react-responsive-modal";
import BackgroundsComponent from "./BackgroundsComponent";


type MediaDialogType= {
  selectedId: string,
  open: boolean,
  onClose?: func
}

@inject("store")
@observer
export default class BackgroundsPickerDialog extends Component<MediaDialogType> {

  constructor(props) {
    super(props);
  }

  getSelectedId() {
    return this.props.selectedId;
  }

  render() {

    return (
      <Modal open={this.props.open} onClose={this.props.onClose} center>
        <BackgroundsComponent selectedId={this.getSelectedId()}/>
      </Modal>
    );
  }
}
