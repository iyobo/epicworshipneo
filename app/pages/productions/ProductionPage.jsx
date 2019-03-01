import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { dict, translate } from "../../../i18n/i18n";
import { Route, Switch } from "react-router";
import ProductionPageComponent from "./ProductionPageComponent";
import { Link, NavLink } from "react-router-dom";

@inject("store")
@observer
export default class ProductionPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showNameModal: false
    };
  }

  onCreateProduction = (prod) => {
    this.props.history.push("/productions/new");
  };

  selectProduction = (prod) => {
    this.props.history.push("/productions/" + prod._id);
  };


  onClone=()=>{
    const prodStore = this.props.store.productionStore;

  }

  onDelete=()=>{
    const prodStore = this.props.store.productionStore;
  }

  onMakeLive=()=>{
    const prodStore = this.props.store.productionStore;
  }

  render() {
    const prodStore = this.props.store.productionStore;
    const liveProductionId = prodStore.liveProductionId;
    const selectedProdId = this.props.match.params.productionId;


    return (
      <div className='uk-animation-slide-right-small'>
        <h2>{dict.menu_productions}</h2>

        <ul className="uk-iconnav">
          <li><button onClick={this.onCreateProduction} data-uk-icon="icon: plus" data-uk-tooltip={dict.production_tooltip_create}/></li>
          {selectedProdId &&
          <Fragment>
            <li><button onClick={this.onClone} uk-icon="icon: copy" uk-tooltip={dict.production_tooltip_clone}/></li>
            <li><button onClick={this.onDelete} uk-icon="icon: trash" uk-tooltip={dict.production_tooltip_delete}/></li>
            <li><button onClick={this.onMakeLive} uk-icon="icon: star" uk-tooltip={dict.production_tooltip_makeLive}/></li>
          </Fragment>
          }
        </ul>

        <div data-uk-grid>
          <div className='uk-width-1-3'>
            <ul className="uk-list itemList">

              {prodStore.productions.map((it) => {
                let isSelected = (it._id ===  selectedProdId) ? "selected" : "";
                let isLive = (it._id === liveProductionId) ? "active" : "";

                return <li className={`${isLive} ${isSelected}`} onClick={() => {
                  this.selectProduction(it);
                }}>{it.name}</li>;
              })}
            </ul>
          </div>
          {}
          <div className='uk-animation-slide-right-small uk-width-expand'>
            <Switch>
              <Route exact path='/productions'
                     component={() => <div>Click + for new production, or click on pre-existing</div>}/>
              <Route exact path='/productions/new' component={ProductionPageComponent}/>
              <Route exact path='/productions/:productionId' component={ProductionPageComponent}/>
            </Switch>
            {/*<div className="uk-card uk-card-default uk-card-body">Item</div>*/}
          </div>

        </div>


      </div>
    );
  }
}
