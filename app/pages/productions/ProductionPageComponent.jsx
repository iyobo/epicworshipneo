import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class ProductionPageComponent extends Component {

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
    const elementStore = this.props.store.productionStore;

    const prodId = this.props.match.params.productionId;
    let production = prodStore.findProductionById(prodId);

    if (!production) {
      production = prodStore.createProduction(this.state.name);
      this.props.history.push("/productions/" + production._id);
    } else {
      production.name = this.state.name;
    }

    this.setState({ name: "" });

  };

  render() {
    const prodStore = this.props.store.productionStore;
    const elementStore = this.props.store.productionStore;

    const prodId = this.props.match.params.productionId;
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
