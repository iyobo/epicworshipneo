import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import ItemList from "./ItemList";
import { dict } from "../../i18n/i18n";

export type TSideBarButton = {
  icon: string,
  tooltip: string,
  handler: func,
  showOnlyIfSelected?: boolean
}

type Props = {
  items: array,
  selectedId?: string,
  activeId?: string,
  idField?: string,
  entityType?: string,
  onItemClick?: func,
  onSearch?: func,
  buttons: array<TSideBarButton>
}

@inject("store")
@observer
export default class SidePanel extends Component<Props> {


  render() {

    const buttons = [];

    this.props.buttons.forEach((it) => {
      if (it.showOnlyIfSelected && this.props.selectedId) {
        buttons.push(<li>
          <button onClick={it.handler} data-uk-icon={`icon: ${it.icon}`}
                  data-uk-tooltip={it.tooltip}/>
        </li>);
      } else if (!it.showOnlyIfSelected) {
        buttons.push(<li>
          <button onClick={it.handler} data-uk-icon={`icon: ${it.icon}`}
                  data-uk-tooltip={it.tooltip}/>
        </li>);
      }
    });

    return (
      <div className='sidePanel'>

        {/*icon nav*/}
        <ul className="uk-iconnav">
          {buttons}
        </ul>

        {/*Searchbar*/}
        <div className='searchBox'>
          <form className="uk-search uk-search-navbar">
            <span data-uk-search-icon/>
            <input className="uk-search-input" type="search" placeholder={dict.field_search + "..."}/>
          </form>
        </div>

        {/*itemlist*/}
        <div className='itemListWrapper'>
          <ItemList items={this.props.items}
                    selectedId={this.props.selectedId}
                    activeId={this.props.activeId}
                    onItemClick={this.props.onItemClick}/>
        </div>
      </div>
    );
  }
}
