import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { dict } from "../../../../i18n/i18n";
import SongsPageComponent from "./SongsPageComponent";
import type { TSideBarButton } from "../../../components/SidePanel";
import SidePanel from "../../../components/SidePanel";
import { elementTypes } from "../../../utils/data";


const elementType = elementTypes.SONG;


@inject("store")
@observer
export default class SongsPage extends Component {

  constructor(props) {
    super(props);
  }

  onCreate = () => {
    this.props.store.navigateToElement(elementType, "new");
  };

  onItemSelect = (item) => {
    this.props.store.navigateToElement(elementType, item._id);
  };

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {

    // this.props.store.elementStore.setLastSelectedProduction(nextProps.match.params.id);
  }

  getSelectedId() {
    return this.props.match.params.id;
  }

  componentDidCatch(error) {
    toast.error({ title: "Oops", message: error.message });
  }

  onClone = async () => {
    const store = this.props.store.elementStore;
    const selectedElementId = this.getSelectedId();

    await store.cloneElement(elementType, selectedElementId);
  };

  onDelete = async () => {
    const store = this.props.store.elementStore;
    const selectedElementId = this.getSelectedId();

    await store.deleteElement(elementType, selectedElementId);
  };

  onAddToProduction = async () => {
    const store = this.props.store.productionStore;
    const selectedElementId = this.getSelectedId();

    const elemStore = this.props.store.elementStore;
    const element = await elemStore.findElement(selectedElementId);
    await store.addToLiveProduction(element);
  };


  buttons: array<TSideBarButton> = [
    { icon: "plus", tooltip: dict.song_tooltip_create, handler: this.onCreate },
    { icon: "copy", tooltip: dict.song_tooltip_clone, handler: this.onClone, showOnlyIfSelected: true },
    { icon: "trash", tooltip: dict.song_tooltip_delete, handler: this.onDelete, showOnlyIfSelected: true },
    { icon: "chevron-right", tooltip: dict.toProduction, handler: this.onAddToProduction, showOnlyIfSelected: true }
  ];

  render() {
    const elementStore = this.props.store.elementStore;
    const selectedElementId = this.getSelectedId();
    // debugger;
    return (
      <div className='uk-animation-slide-right-small'>
        <h2>{dict.menu_songs}</h2>

        <div className='flexContainer'>
          <SidePanel items={elementStore[elementType + "s"]}
                     selectedId={selectedElementId}
            // elementType={elementTypes.PRODUCTION}
                     enableSearch={true}
                     buttons={this.buttons}
                     onItemClick={(item) => this.onItemSelect(item)}/>

          <div className='uk-animation-slide-right-small '>
            <SongsPageComponent selectedId={selectedElementId}/>
          </div>
        </div>
      </div>
    );
  }
}
