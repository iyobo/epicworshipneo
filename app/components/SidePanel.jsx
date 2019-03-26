import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import ItemList from "./ItemList";
import { dict } from "../../i18n/i18n";
import _ from "lodash";

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
  onClearSearch?: func,
  buttons: array<TSideBarButton>,
  enableSearch: boolean
}

@inject("store")
@observer
export default class SidePanel extends Component<Props> {

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      items: props.items,
      searchVal: ""
    };
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    this.setState({ items: !this.state.searchVal ? this.props.items : this.state.items });
  }

  //

  onSearch = async (evt) => {
    evt.preventDefault();

    const searchVal = evt.target.value;
    this.setState({ searchVal });


    //if parent has a different search function, use that
    if (searchVal) {
      if (this.props.onSearch)
        this.props.onSearch(searchVal);
      else if (this.props.entityType) {
        //If no parental search function, we can figure out a default search behavior depending on entityType

        //TODO: implement default entity type search behavior
        const result = await this.props.store.productionStore.searchProductions(searchVal);
        this.setState({ items: result });
      } else {
        // okay we don't know how to search on the database, so let's just do a Javascript search.
        // With a large list of items, this will block the UI per keystroke. Try to not rely on this so much!
        const regex = new RegExp(".*" + searchVal + ".*", "i");

        const result = _.filter(this.props.items, (it) => {
          let include = regex.test(it.name);

          //if this item has content, search inside it too
          if (!include && it.content) {
            include = regex.test(it.content.toString()); //text body?
          }

          return include;
        });

        this.setState({ items: result });
      }
    } else {
      this.setState({ items: this.props.items });
    }
  };

  clearSearch = () => {
    this.setState({ searchVal: "" });
    if (this.props.onClearSearch) this.props.onClearSearch();
  };

  render() {

    let items = this.state.items;

    const buttons = [];

    this.props.buttons.forEach((it) => {
      let renderMe = false;
      if (it.showOnlyIfSelected && this.props.selectedId) {
        renderMe = true;
      } else if (!it.showOnlyIfSelected) {
        renderMe = true;
      }

      if (renderMe) {
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
        {this.props.enableSearch &&
          <div className='searchBox'>
            <div className="uk-search uk-search-navbar">
              <div style={{
                width: "90%",
                display: "inline-block",
                border: "1px solid bisque",
                marginRight: 5,
                borderRadius: 8
              }}>
                <span data-uk-search-icon/>
                <input name='text'
                       value={this.state.searchVal}
                       onChange={(evt) => this.onSearch(evt)}
                       className="uk-search-input" type="search"
                       placeholder={dict.field_search + "..."}/>
              </div>
              <a href="#" uk-icon="ban" onClick={this.clearSearch} data-uk-tooltip={dict.clearSearch}/>
            </div>
          </div>
        }

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
