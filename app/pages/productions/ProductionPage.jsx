import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { dict, translate } from "../../../i18n/i18n";
import { Route, Switch } from "react-router";
import ProductionPageComponent from "./ProductionPageComponent";
import { Link } from "react-router-dom";

@inject("store")
@observer
export default class ProductionPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showNameModal: false,
      selectedId: null
    };
  }

  selectProduction = (prod) => {
    const prodStore = this.props.store.productionStore;
    // prodStore.setSelectedProduction(prod._id);
    this.props.history.push("/productions/" + prod._id);
    this.setState({selectedId: prod._id})
  };

  render() {
    const prodStore = this.props.store.productionStore;
    const liveProductionId = prodStore.liveProductionId;
    const selectedProdId = this.state.selectedId;


    return (
      <div className='uk-animation-slide-right-small'>
        <h2>{translate("menu_productions")}</h2>

        <ul className="uk-iconnav">
          <li><Link to='/productions/new' data-uk-icon="icon: plus" data-uk-tooltip={dict.production_tooltip_create}/></li>
          {selectedProdId &&
          <Fragment>
            <li><a href="#" uk-icon="icon: copy" uk-tooltip={dict.production_tooltip_clone}></a></li>
            <li><a href="#" uk-icon="icon: trash" uk-tooltip={dict.production_tooltip_delete}></a></li>
          </Fragment>
          }
        </ul>

        <div data-uk-grid>
          <div className='uk-width-1-3'>
            <ul className="uk-list itemList">

              {prodStore.productions.map((it) => {
                console.log(it);
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
