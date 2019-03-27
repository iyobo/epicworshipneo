import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { dict } from "../../../../i18n/i18n";
import { Link } from "react-router-dom";
import { elementTypes } from "../../../utils/data";

const elementType = elementTypes.SONG;

type Props = {
  selectedId?: string
}

@inject("store")
@observer
export default class SongsPageComponent extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      content: ""
    };
  }

  onSubmit = async (evt) => {
    evt.preventDefault();

    if (!this.state.name) return toast.error({
      title: "Invalid element name",
      message: "Every element needs a good name"
    });

    const elementStore = this.props.store.elementStore;
    const elementId = this.props.selectedId;
    let element = await elementStore.songMap[elementId];

    if (!element) {
      element = await elementStore.createElement(elementType, this.state.name, this.state.content);
    } else {
      element.name = this.state.name;
    }
    // debugger;
    this.setState({ name: "" });
    this.props.store.navigateToElement(elementType, element._id);

  };

  render() {
    const elementStore = this.props.store.elementStore;
    const elementId = this.props.selectedId ; //if id='new' go all the way down and work with null element
    // debugger;
    console.log({elementId})

    // If still no id then no current or previous selection
    if (!elementId) return <div>{dict.song_page_instructions}</div>;

    const element = elementStore.getElement(elementType, elementId);

    return (
      <section className='uk-animation-slide-right-small'>
        <form onSubmit={this.onSubmit}>
          <fieldset className="uk-fieldset">

            <legend className="uk-legend">{element ? element.name : dict.newelement}</legend>

            <div className="uk-margin">
              <b>{dict.field_name}</b>
              <input className="uk-input" type="text" name="name" autoFocus={true}
                     placeholder={element ? element.name : "New element"}
                     onChange={(evt) => {
                       this.setState({ name: evt.target.value });
                     }}
                     value={this.state.name}/>
            </div>


            <br/>
            <button type='submit' className="uk-button uk-button-primary">{element ? "Save" : "Create"}</button>

          </fieldset>
        </form>
      </section>
    );
  }
}
