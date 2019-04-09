import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import MediaComponent from "./MediaComponent";
import Modal from "react-responsive-modal";


type MediaDialogType= {
  selectedId: string,
  open: boolean,
  onClose?: func
}

@inject("store")
@observer
export default class MediaPickerDialog extends Component<MediaDialogType> {

  constructor(props) {
    super(props);
  }

  getSelectedId() {
    return this.props.selectedId;
  }

  render() {

    return (
      <Modal open={this.props.open} onClose={this.props.onClose} center>
        <MediaComponent selectedId={this.getSelectedId()}/>
      </Modal>
    );
  }
}
