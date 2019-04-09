import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { dict } from "../../../i18n/i18n";
import ProductionPageComponent from "./ProductionPageComponent";
import type { TSideBarButton } from "../../components/ItemList";
import ItemList from "../../components/ItemList";

@inject("store")
@observer
export default class ProductionPage extends Component {

  constructor(props) {
    super(props);
  }

  onCreateProduction = () => {
    this.props.store.navigateToProduction("new");
  };

  selectProduction = (prod) => {
    this.props.store.navigateToProduction(prod._id);
  };

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {

    this.props.store.productionStore.setLastSelectedProduction(nextProps.match.params.id);
  }

  getSelectedId() {
    const prodStore = this.props.store.productionStore;
    return this.props.match.params.id || prodStore.lastSelectedProductionId;
  }

  componentDidCatch(error) {
    toast.error({ title: "Oops", message: error.message });
  }

  onClone = async () => {
    const prodStore = this.props.store.productionStore;
    const selectedProdId = this.getSelectedId();

    await prodStore.cloneProduction(selectedProdId);
  };

  onDelete = async () => {
    const prodStore = this.props.store.productionStore;
    const selectedProdId = this.getSelectedId();

    await prodStore.deleteProduction(selectedProdId);
  };

  onMakeLive = async (itemId) => {
    const prodStore = this.props.store.productionStore;
    console.log('Making production live',itemId)
    await prodStore.makeProductionLive(itemId);
  };

  buttons: array<TSideBarButton> = [
    { icon: "plus", tooltip: dict.production_tooltip_create, handler: this.onCreateProduction },
    { icon: "copy", tooltip: dict.production_tooltip_clone, handler: this.onClone, showOnlyIfSelected: true },
    { icon: "trash", tooltip: dict.production_tooltip_delete, handler: this.onDelete, showOnlyIfSelected: true },
    { icon: "star", tooltip: dict.production_tooltip_makeLive, handler: this.onMakeLive, showOnlyIfSelected: true }
  ];

  render() {
    const prodStore = this.props.store.productionStore;
    const liveProductionId = prodStore.liveProductionId;
    const selectedProdId = this.getSelectedId();

    return (
      <div className='uk-animation-slide-right-small'>
        <h2>{dict.menu_productions}</h2>

        <div className='flexContainer'>

          <ItemList items={prodStore.productions}
                    selectedId={selectedProdId}
                    activeId={liveProductionId}
            // elementType={elementTypes.PRODUCTION}
                    startingHeight={270}
                    enableSearch={true}
                    buttons={this.buttons}
                    stretch
                    onItemClick={(item) => this.selectProduction(item)}
                    onItemDoubleClick={(item)=> this.onMakeLive(item._id)}
          />

          <div className='uk-animation-slide-right-small '>
            <ProductionPageComponent selectedId={selectedProdId}/>
          </div>
        </div>

      </div>

    );
  }
}
