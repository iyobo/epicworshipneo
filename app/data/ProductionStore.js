import { observable, action, computed } from "mobx";

const chance = new require("chance")();

export default class ProductionStore {

  @observable productionHash = {};
  @observable liveProductionId;

  constructor(appStore) {
    this.appStore = appStore;

    //TODO: load all productions into memory

  }

  @action
  setLiveProduction = (productionId) => {
    this.liveProductionId = productionId;
  };

  get liveProduction() {
    return this.productionHash[this.liveProductionId];
  };

  findProductionById(id) {
    return this.productionHash[id];
  }

  @computed get productions() {
    return Object.values(this.productionHash).reverse();
  }

  @action
  createProduction = (name) => {
    const newProduction = {
      _id: chance.guid(),
      name,
      schedule: [] // {_id: chance.guid(), elementId}
    };

    this.productionHash[newProduction._id] = newProduction;

    return newProduction;
  };


}