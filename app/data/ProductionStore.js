import { observable, action, computed } from "mobx";
import { entityTypes } from "../utils/data";

const _ = require("lodash");

const chance = new require("chance")();

export default class ProductionStore {

  @observable productionHash = {};
  @observable liveProductionId;
  lastSelectedProductionId;

  constructor(appStore) {
    this.appStore = appStore;

    //TODO: load all productions into memory

    Array(20).fill().forEach((it) => {
      this.createProduction(chance.weekday() + " " + chance.date({ string: true }));
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
    const arr = Object.values(this.productionHash);
    arr.sort(function(a, b) {
      return b.dateCreated - a.dateCreated;
    });
    return arr;
  }

  @action
  createProduction = (name) => {
    const newProduction = {
      _id: chance.guid(),
      name,
      dateCreated: new Date(),
      entityType: entityTypes.PRODUCTION,
      items: [] // {_id: chance.guid(), elementId}
    };

    this.productionHash[newProduction._id] = newProduction;

    return newProduction;
  };

  cloneProduction = (productionId) => {
    const production = this.productionHash[productionId];
    if (!production) throw new Error(`Clone: Cannot find production of Id ${productionId}`);

    const newProduction = _.cloneDeep(production);
    newProduction._id = chance.guid();
    newProduction.name += " clone " + new Date().toLocaleTimeString();
    newProduction.dateCreated = new Date();
    this.productionHash[newProduction._id] = newProduction;

    this.appStore.navigateToProduction(newProduction._id);
  };

  deleteProduction = (productionId) => {
    const production = this.productionHash[productionId];
    if (!production) throw new Error(`Delete: Cannot find production of Id ${productionId}`);

    delete this.productionHash[productionId];
    this.appStore.navigateToProduction(null);
  };

  makeProductionLive = (productionId) => {
    const production = this.productionHash[productionId];
    if (!production) throw new Error(`Live: Cannot find production of Id ${productionId}`);

    this.setLiveProduction(productionId);

  };

}