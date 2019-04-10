import React, { Component } from "react";
import { inject, observer } from "mobx-react";
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
  elementType?: string,
  onItemClick?: func,
  onItemDoubleClick?: func,
  onSearch?: func,
  onClearSearch?: func,
  buttons: array<TSideBarButton>,
  enableSearch?: boolean,
  startingHeight?: number,
  percentageHeight?: number,
  nameField?: string,
  textField?: string,
  hideDeleted?: boolean,
  stretch?: boolean, //if true, use startingHeight and percentageHeight
  expandElements?: boolean //If this is true, expect each item to have elementId and elementType. Use element for name and text

}

@inject("store")
@observer
export default class ItemList extends Component<Props> {

  static defaultProps = {
    startingHeight: 320,
    percentageHeight: 100,
    idField: "_id",
    nameField: "name",
    textField: "text",
    hideDeleted: true,
    buttons: []
  };

  constructor(props) {
    super(props);

    this.state = {
      items: props.items,
      searchVal: "",
      selectedId: null
    };
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    this.setState({ items: !this.state.searchVal ? this.props.items : this.state.items });
  }


  onSearch = async (evt) => {
    evt.preventDefault();

    const searchVal = evt.target.value;
    this.setState({ searchVal });

    //if parent has a different search function, use that
    if (searchVal) {
      if (this.props.onSearch)
        this.props.onSearch(searchVal);
      // else if (this.props.elementType) {
      //   //If no parental search function, we can figure out a default search behavior depending on elementType
      //
      //   //FIXME: implement default entity type search behavior
      //   const result = await this.props.store.productionStore.searchProductions(searchVal);
      //   this.setState({ items: result });
      // }
      else {
        // TODO: okay we don't know how to search on the pouchdb database right now. Bad Wifi. Can't check. So let's just do a Javascript search.
        // With a large list of items, this will block the UI per keystroke. Try to not rely on this so much.
        const regex = new RegExp(".*" + searchVal + ".*", "i");

        const result = _.filter(this.props.items, (it) => {
          let include = regex.test(it[this.props.nameField]);

          //if not elected, if this item has a text, search inside it too
          if (!include && it[this.props.textField]) {
            include = regex.test(it[this.props.textField]); //text body?
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

    const elementStore = this.props.store.elementStore;
    const idField = this.props.idField;
    const selectedId = this.state.selectedId || this.props.selectedId;
    const items = this.state.items || this.props.items;


    let wrapperStyle = this.props.stretch ?
      { height: `calc(${this.props.percentageHeight}vh - ${this.props.startingHeight}px)` }
      : {};


    const buttons = [];

    this.props.buttons.forEach((it) => {
      let renderMe = false;
      if (it.showOnlyIfSelected && selectedId) {
        renderMe = true;
      } else if (!it.showOnlyIfSelected) {
        renderMe = true;
      }

      if (renderMe) {
        buttons.push(<li key={it.icon}>
          <button onClick={(evt)=>it.handler(selectedId,evt)} data-uk-icon={`icon: ${it.icon}`}
                  data-uk-tooltip={it.tooltip}/>
        </li>);
      }
    });


    const renderedItems=[];
    for(let it of items) {
      let isSelected = (it[idField] === selectedId) ? "selected" : "";
      let isActive = (it[idField] === this.props.activeId) ? "active" : "";

      let name = it[this.props.nameField];

      if (this.props.expandElements) {
        const element = elementStore.getElement(it.elementType, it.elementId);

        if(!element && this.props.hideDeleted) continue;

        name = element ? element.name : "*DELETED*";

      }


      renderedItems.push(<li key={it[idField]}
                 className={`${isActive} ${isSelected} hardWrap`}
                 onClick={() => {
                   this.setState({ selectedId: it[idField] });
                   if (this.props.onItemClick) this.props.onItemClick(it);
                 }}
                 onDoubleClick={() => {
                   this.setState({ selectedId: it[idField] });
                   if (this.props.onItemDoubleClick) this.props.onItemDoubleClick(it);
                 }}>{name}</li>);
    }

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
              width: "80%",
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
                     placeholder={dict.search + "..."}/>
            </div>
            <a href="#" uk-icon="ban"
               style={{ color: "red" }}
               onClick={this.clearSearch}
               data-uk-tooltip={dict.clearSearch}/>
          </div>
        </div>
        }

        {/*itemlist*/}
        <div className='itemListWrapper' style={wrapperStyle}>
          <ul className="uk-list itemList">

            {renderedItems}
          </ul>
        </div>
      </div>
    );
  }
}
