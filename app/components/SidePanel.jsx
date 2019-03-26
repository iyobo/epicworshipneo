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

  static defaultProps = {};

  constructor(props){
    super(props);

    this.state={
      items: props.items,
      searchVal:''
    }
  }

  //

  onSearch = async (evt) => {
    evt.preventDefault();

    const searchVal = this.state.searchVal;
    if (this.props.onSearch)
      this.props.onSearch(searchVal);
    else if (this.props.entityType) {
      //TODO: implement default entity type search behavior
      const result = await this.props.store.productionStore.searchProductions(searchVal);
      this.setState({items: result});
    }
  };

  render() {

    let items = !this.state.searchVal? this.props.items: this.state.items;

    const buttons = [];

    this.props.buttons.forEach((it) => {
      let renderMe = false;
      if (it.showOnlyIfSelected && this.props.selectedId) {
        renderMe = true;
      } else if (!it.showOnlyIfSelected) {
        renderMe = true;
      }

      if(renderMe) {
        buttons.push(<li key={it.icon}>
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
          <form className="uk-search uk-search-navbar" onSubmit={this.onSearch}>
            <span data-uk-search-icon/>
            <input name='text' onChange={(evt)=>this.setState({searchVal: evt.target.value})} className="uk-search-input" type="search" placeholder={dict.field_search + "..."}/>
          </form>
        </div>

        {/*itemlist*/}
        <div className='itemListWrapper'>
          <ItemList items={items}
                    selectedId={this.props.selectedId}
                    activeId={this.props.activeId}
                    onItemClick={this.props.onItemClick}/>
        </div>
      </div>
    );
  }
}
