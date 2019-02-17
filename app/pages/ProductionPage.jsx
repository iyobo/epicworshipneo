import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class ProductionPage extends Component {
  render() {
    const activeProd = this.props.store.productionStore

    return (
      <div className='uk-animation-slide-right-small'>
        <h2>Productions</h2>

        <ul className="uk-iconnav">
          <li><a href="#" uk-icon="icon: plus"></a></li>
          <li><a href="#" uk-icon="icon: file-edit"></a></li>
          <li><a href="#" uk-icon="icon: copy"></a></li>
          <li><a href="#" uk-icon="icon: trash"></a></li>
        </ul>

        <div className="uk-grid-small uk-child-width-expand@s" data-uk-grid>
          <div>
            <ul className="uk-list uk-list-striped itemList">
              <li>List item 2 <a href="#" uk-icon="icon: file-edit"></a> <a href="#" uk-icon="icon: trash"></a> </li>
            </ul>
          </div>
          {}
          <div className='uk-animation-slide-right-small'>
            <div className="uk-card uk-card-default uk-card-body">Item</div>
          </div>
        </div>


      </div>
    );
  }
}
