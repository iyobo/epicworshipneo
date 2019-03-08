import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { dict, translate } from "../../../i18n/i18n";
import { Route, Switch } from "react-router";
import ProductionPageComponent from "./ProductionPageComponent";
import { Link, NavLink } from "react-router-dom";
import ItemList from "../../components/ItemList";

@inject("store")
@observer
export default class ProductionPage extends Component {

  constructor(props) {
    super(props);
  }

  onCreateProduction = (prod) => {
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

  onClone = () => {
    const prodStore = this.props.store.productionStore;
    const selectedProdId = this.getSelectedId();

    prodStore.cloneProduction(selectedProdId);
  };

  onDelete = () => {
    const prodStore = this.props.store.productionStore;
    const selectedProdId = this.getSelectedId();

    prodStore.deleteProduction(selectedProdId);
  };

  onMakeLive = () => {
    const prodStore = this.props.store.productionStore;
    const selectedProdId = this.getSelectedId();

    prodStore.makeProductionLive(selectedProdId);
  };

  render() {
    const prodStore = this.props.store.productionStore;
    const liveProductionId = prodStore.liveProductionId;
    const selectedProdId = this.getSelectedId();

    return (
      <div className='uk-animation-slide-right-small'>
        <h2>{dict.menu_productions}</h2>

        <ul className="uk-iconnav">
          <li>
            <button onClick={this.onCreateProduction} data-uk-icon="icon: plus"
                    data-uk-tooltip={dict.production_tooltip_create}/>
          </li>
          {selectedProdId &&
          <Fragment>
            <li>
              <button onClick={this.onClone} uk-icon="icon: copy" uk-tooltip={dict.production_tooltip_clone}/>
            </li>
            <li>
              <button onClick={this.onDelete} uk-icon="icon: trash" uk-tooltip={dict.production_tooltip_delete}/>
            </li>
            <li>
              <button onClick={this.onMakeLive} uk-icon="icon: star" uk-tooltip={dict.production_tooltip_makeLive}/>
            </li>
          </Fragment>
          }
        </ul>
        <div style={{marginTop:10}}>
          <form className="uk-search uk-search-default" style={{width: '100%'}}>
            <input className="uk-search-input" type="search" placeholder="Search..." />
          </form>
        </div>

        <div data-uk-grid>
          <div className='uk-width-1-3'>
            <div>

              <div className='sidePanel'>
                <ItemList items={prodStore.productions}
                          selectedId={selectedProdId}
                          activeId={liveProductionId}
                          onItemClick={(item) => this.selectProduction(item)}/>
              </div>
            </div>
          </div>


          <div className='uk-animation-slide-right-small uk-width-expand'>
            <ProductionPageComponent selectedId={selectedProdId}/>
          </div>

        </div>


      </div>
    );
  }
}
