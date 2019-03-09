import { observable, action, computed } from "mobx";
import { entityTypes } from "../utils/data";
import { epicDB } from "./localdb";

const _ = require("lodash");

const chance = new require("chance")();

export default class ProductionStore {

  @observable productions = [];
  // @observable productionIndex = {};
  @observable liveProductionId;
  lastSelectedProductionId;

  constructor(appStore) {
    this.appStore = appStore;

    this._loadProductionsFromDB();


  }

  async _loadProductionsFromDB() {


    // Array(20).fill().forEach((it) => {
    //   this.createProduction(chance.weekday() + " " + chance.date({ string: true }));
    // });

    const result = await epicDB.api.findAll({ entityTypes: entityTypes.PRODUCTION });
    result.sort(function(a, b) {
      return b.dateCreated - a.dateCreated;
    });
    this.productions = result;
  }

  @computed get productionIndex() {
    const map = {};

    this.productions.forEach((it) => {
      map[it._id] = it;
    });

    return map;
  }

  @action
  setLiveProduction = (productionId) => {
    this.liveProductionId = productionId;
  };

  get liveProduction() {
    return this.productionIndex[this.liveProductionId];
  };

  setLastSelectedProduction = (productionId) => {
    this.lastSelectedProductionId = productionId;
  };

  get lastSelectedProduction() {
    return this.productionIndex[this.lastSelectedProductionId];
  };


  findProductionById(id) {
    return this.productionIndex[id];
  }

  // @action
  // deriveProductions() {
  //   const arr = Object.values(this.productionIndex);
  //   arr.sort(function(a, b) {
  //     return b.dateCreated - a.dateCreated;
  //   });
  //   this.productions = arr;
  // }
  //
  // @action
  // deriveProductionIndex() {
  //   const map = {}
  //
  //   this.productions.forEach((it)=>{
  //     map[it._id]= it;
  //   })
  //
  //   this.productionIndex = map;
  // }

  @action
  createProduction = (name) => {
    const newProduction = {
      _id: chance.guid(),
      name,
      dateCreated: new Date(),
      entityType: entityTypes.PRODUCTION,
      items: [] // {_id: chance.guid(), elementId}
    };

    //add in store
    this.productions.unshift(newProduction);

    //add in db
    epicDB.api.add(newProduction);

    return newProduction;
  };


  cloneProduction = (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Clone: Cannot find production of Id ${productionId}`);

    const newProduction = _.cloneDeep(production);
    newProduction._id = chance.guid();
    newProduction.name += " clone " + new Date().toLocaleTimeString();
    newProduction.dateCreated = new Date();

    this.productions.unshift(newProduction);
    epicDB.api.add(newProduction);

    this.appStore.navigateToProduction(newProduction._id);
  };

  deleteProduction = (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Delete: Cannot find production of Id ${productionId}`);


    _.remove(this.productions, { _id: productionId });
    epicDB.api.remove(productionId);

    this.appStore.navigateToProduction(null);
  };

  makeProductionLive = (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Live: Cannot find production of Id ${productionId}`);

    this.setLiveProduction(productionId);

  };

}