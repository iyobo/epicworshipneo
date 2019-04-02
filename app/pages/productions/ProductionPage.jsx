import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { dict, translate } from "../../../i18n/i18n";
import { Route, Switch } from "react-router";
import ProductionPageComponent from "./ProductionPageComponent";
import { Link, NavLink } from "react-router-dom";
import ItemList from "../../components/ItemList";
import SidePanel from "../../components/SidePanel";
import { elementTypes } from "../../utils/data";
import type { TSideBarButton } from "../../components/SidePanel";

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

  onMakeLive = async () => {
    const prodStore = this.props.store.productionStore;
    const selectedProdId = this.getSelectedId();

    await prodStore.makeProductionLive(selectedProdId);
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

          <SidePanel items={prodStore.productions}
                     selectedId={selectedProdId}
                     activeId={liveProductionId}
            // elementType={elementTypes.PRODUCTION}
                     startingHeight={270}
                     enableSearch={true}
                     buttons={this.buttons}
                     onItemClick={(item) => this.selectProduction(item)}/>

          <div className='uk-animation-slide-right-small '>
            <ProductionPageComponent selectedId={selectedProdId}/>
          </div>
        </div>

      </div>

    );
  }
}
