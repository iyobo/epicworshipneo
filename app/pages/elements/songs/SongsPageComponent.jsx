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
      text: ""
    };
  }

  componentDidMount(): void {
    this._refresh(this.props)
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (this.props.selectedId !== nextProps.selectedId) {
      this._refresh(nextProps)
    }
  }

  _refresh=(props)=>{
    const elementStore = props.store.elementStore;
    const element = elementStore.getElement(elementType, props.selectedId);

    // debugger;

    if (element) {
      // console.log(element);
      this.setState({ name: element.name, text: element.text });
    } else if (props.selectedId === "new") {
      this.setState({ name: "", text: "" });
    }
  }


  onSubmit = async (evt) => {
    evt.preventDefault();

    if (!this.state.name) return toast.error({
      title: `Empty ${elementType} name`,
      message: `Every ${elementType} needs a good name`
    });
    if (!this.state.text) return toast.error({
      title: `Empty ${elementType} body`,
      message: `Every ${elementType} needs a good body`
    });

    const elementStore = this.props.store.elementStore;
    const elementId = this.props.selectedId;
    let element = elementStore.getElement(elementType, elementId);

    if (!element) {
      element = await elementStore.createElement(elementType, this.state.name, this.state.text);
    } else {
      element.name = this.state.name;
      element.text = this.state.text;
      await elementStore.updateElement(element);
    }
    // debugger;
    // this.setState({ name: "" });
    this.props.store.navigateToElement(elementType, element._id);

  };

  render() {
    const elementStore = this.props.store.elementStore;
    const elementId = this.props.selectedId; //if id='new' go all the way down and work with null element
    // debugger;
    // console.log({ elementId });

    // If still no id then no current or previous selection
    if (!elementId) return <div>{dict.song_page_instructions}</div>;

    const element = elementStore.getElement(elementType, elementId);
    // debugger;

    return (
      <section className='uk-animation-slide-right-small'>
        <form onSubmit={this.onSubmit}>
          <fieldset className="uk-fieldset">

            <legend className="uk-legend">{element ? element.name : dict.song_tooltip_create}</legend>

            <div className="uk-margin">
              <b>{dict.field_name}</b>
              <input className="uk-input"
                     type="text"
                     name="name"
                     autoFocus={true}
                     onChange={(evt) => {
                       this.setState({ name: evt.target.value });
                     }}
                     value={this.state.name}/>
            </div>

            <div className="uk-margin">
              <div><b>{dict.field_text}</b></div>
              <textarea className="uk-input epicTextArea"
                        name="text"
                        onChange={(evt) => {
                          this.setState({ text: evt.target.value });
                        }}
                        value={this.state.text} />
            </div>


            <br/>
            <button type='submit' className="uk-button uk-button-primary">{element ? "Save" : "Create"}</button>

          </fieldset>
        </form>
      </section>
    );
  }
}
