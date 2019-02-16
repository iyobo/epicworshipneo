import { observable, action } from "mobx";

export default class ProductionStore {

  @observable productions = [];
  @observable activeProduction;

  constructor(appStore) {
    this.appStore = appStore;
  }

  @action
  setActiveProduction = (production) => {
    this.activeProduction = production;
  };


}