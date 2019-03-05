import { observable, action, computed } from "mobx";

const chance = new require("chance")();

export default class ProductionStore {

  @observable productionHash = {};
  @observable liveProductionId;
  lastSelectedProductionId;

  constructor(appStore) {
    this.appStore = appStore;

    //TODO: load all productions into memory

    Array(20).fill().forEach((it)=>{
      this.createProduction(chance.date({string: true}))
    });

  }

  @action
  setLiveProduction = (productionId) => {
    this.liveProductionId = productionId;
  };
  get liveProduction() {
    return this.productionHash[this.liveProductionId];
  };

  setLastSelectedProduction = (productionId) => {
    this.lastSelectedProductionId = productionId;
  };
  get lastSelectedProduction() {
    return this.productionHash[this.lastSelectedProductionId];
  };




  findProductionById(id) {
    return this.productionHash[id];
  }

  @computed get productions() {
    return Object.values(this.productionHash);
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