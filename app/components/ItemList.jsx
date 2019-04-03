import React, { Component } from "react";

type Props = {
  items: array,
  selectedId?: string,
  activeId?: string,
  idField?: string,
  onItemClick?: func
}

export default class ItemList extends Component<Props> {

  static defaultProps = {
    idField: "id",
    onItemClick: () => {
    }
  };

  render() {
    const idField = this.props.idField;

    return (

        <ul className="uk-list itemList">

          {this.props.items.map((it) => {
            let isSelected = (it[idField] === this.props.selectedId) ? "selected" : "";
            let isActive = (it[idField] === this.props.activeId) ? "active" : "";

            return <li key={it[idField]} className={`${isActive} ${isSelected}`} onClick={() => {
              this.props.onItemClick(it);
            }}>{it.name}</li>;
          })}
        </ul>
    );
  }
}
