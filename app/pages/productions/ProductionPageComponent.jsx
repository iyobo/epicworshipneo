import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { dict } from "../../../i18n/i18n";
import { Link } from "react-router-dom";


type Props = {
  selectedId?: string
}

@inject("store")
@observer
export default class ProductionPageComponent extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  onSubmit = async (evt) => {
    evt.preventDefault();

    if (!this.state.name) return toast.error({
      title: "Invalid Production name",
      message: "Every production needs a good name"
    });

    const prodStore = this.props.store.productionStore;
    const prodId = this.props.selectedId;
    let production = await prodStore.findProductionById(prodId);

    if (!production) {
      production = await prodStore.createProduction(this.state.name);
    } else {
      production.name = this.state.name;
    }
    // debugger;
    this.setState({ name: "" });
    this.props.store.navigateToProduction(production._id);

  };

  render() {
    const prodStore = this.props.store.productionStore;
    const prodId = this.props.selectedId || prodStore.lastSelectedProductionId; //if id='new' go all the way down and work with null production

    // If still no id then no current or previous selection
    if (!prodId) return <div>{dict.production_page_instructions}</div>;

    const production = prodStore.findProductionById(prodId);

    const isLive = prodId && prodStore.liveProductionId === prodId;
    const BlankLook = isLive ?
      ()=><p><i>{dict.production_page_noElements}</i>. <Link to='/elements'>{dict.production_page_noElementsGoAdd}</Link></p>
      :
      ()=><p><i>{dict.production_page_noElements}</i></p>;

    return (
      <section className='uk-animation-slide-right-small'>
        <form onSubmit={this.onSubmit}>
          <fieldset className="uk-fieldset">

            <legend className="uk-legend">{production ? production.name : dict.newProduction}</legend>

            <div className="uk-margin">
              <b>{dict.field_name}</b>
              <input className="uk-input" type="text" name="name" autoFocus={true}
                     placeholder={production ? production.name : "New Production"}
                     onChange={(evt) => {
                       this.setState({ name: evt.target.value });
                     }}
                     value={this.state.name}/>
            </div>

            {production && <div>
              <h4>{dict.field_elements}</h4>
              {production.items.length > 0 ? <ul className="uk-list uk-list-striped itemList">
                {production.items.map(it => {
                  return <li>{it}</li>;
                })}
              </ul>
              :
                <BlankLook />
              }
            </div>
            }
            <br/>
            <button type='submit' className="uk-button uk-button-primary">{production ? "Save" : "Create"}</button>

          </fieldset>
        </form>
      </section>
    );
  }
}
