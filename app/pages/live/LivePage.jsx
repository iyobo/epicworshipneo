import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import ItemList from "../../components/ItemList";

@inject("store")
@observer
export default class LivePage extends Component {

  onItemClick = (item) => {
    this.props.store.screenStore.sendToProjector('',item.payload);
  };

  render() {
    const elementStore = this.props.store.elementStore;
    const prodStore = this.props.store.productionStore;
    return (
      <div className='uk-animation-slide-right-small'>
        <h2>Live</h2>
        <ItemList items={prodStore.liveProductionScenePages}
          // selectedId={selectedElementId}
          // elementType={elementTypes.PRODUCTION}
          //         enableSearch={true}
          //         buttons={this.buttons}
          // stretch
                  onItemClick={this.onItemClick}
          // onItemDoubleClick={this.onItemDoubleClick}
        />

      </div>
    );
  }
}
