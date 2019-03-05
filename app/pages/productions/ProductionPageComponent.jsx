import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { dict } from "../../../i18n/i18n";


type Props= {
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

  onSubmit = (evt) => {
    evt.preventDefault();

    if(!this.state.name) return toast.error({title: 'Invalid Production name', message:'Every production needs a good name'})

    const prodStore = this.props.store.productionStore;
    const prodId = this.props.selectedId;
    let production = prodStore.findProductionById(prodId);

    if (!production) {
      production = prodStore.createProduction(this.state.name);
    } else {
      production.name = this.state.name;
    }

    this.setState({ name: "" });
    this.props.store.navigateToProduction(production._id);

  };

  render() {
    const prodStore = this.props.store.productionStore;
    const prodId = this.props.selectedId || prodStore.lastSelectedProductionId; //if id='new' go all the way down and work with null production

    // If still no id then no current or previous selection
    if(!prodId) return <div>{dict.production_page_instructions}</div>

    const production = prodStore.findProductionById(prodId);

    return (
      <section className='uk-animation-slide-right-small'>
        <form onSubmit={this.onSubmit}>
          <fieldset className="uk-fieldset">

            <legend className="uk-legend">{production ? production.name : "New Production"}</legend>

            <div className="uk-margin">
              <b>Name</b>
              <input className="uk-input" type="text" name="name" autoFocus={true}
                     placeholder={production ? production.name : "New Production"}
                     onChange={(evt) => {
                       this.setState({ name: evt.target.value });
                     }}
                     value={this.state.name}/>
            </div>

            {production && <div>
              <b>Schedule</b>
              <ul className="uk-list uk-list-striped itemList">
                {production.schedule.map(it => {
                  return <li>{it}</li>;
                })}
              </ul>
            </div>
            }
            <button type='submit' className="uk-button uk-button-primary">{production ? "Save" : "Create"}</button>

          </fieldset>
        </form>
      </section>
    );
  }
}
