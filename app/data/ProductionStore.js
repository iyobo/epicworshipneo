import { action, computed, observable } from "mobx";
import { entityTypes } from "../utils/data";
import { epicDB } from "./localdb";

const _ = require("lodash");

const chance = new require("chance")();

export default class ProductionStore {

  @observable productions = [];
  @observable liveProductionId;
  lastSelectedProductionId;

  constructor(appStore) {
    this.appStore = appStore;

    this._loadProductionsFromDB();

  }

  async _loadProductionsFromDB() {

    const {docs} = await epicDB.db.find({
      selector: {
        entityType: entityTypes.PRODUCTION,
      },
      // sort: ["dateCreated"]
    });
    // debugger;
    docs.sort(function(a, b) {
      return b.dateCreated - a.dateCreated;
    });
    this.productions = docs;

    const live = await epicDB.api.find('app.liveProductionId').then(this.setLiveProduction);
    // this.setLiveProduction(live);
  }

  //FIXME: fix this
  async searchProductions(search) {

    const {docs} = await epicDB.db.find({
      selector: {
        entityType: entityTypes.PRODUCTION,
        name: { $regex: new RegExp(`.*${search}.*`) }
      },
      // sort: ["dateCreated"]
    });
    docs.sort(function(a, b) {
      return b.dateCreated - a.dateCreated;
    });

    return docs;
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
    console.log('setting Live production', productionId)
    this.liveProductionId = productionId;
  };

  makeProductionLive = (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Live: Cannot find production of Id ${productionId}`);

    this.setLiveProduction(productionId);
    epicDB.api.updateOrAdd('app.liveProductionId', {productionId});
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
  createProduction = async (name) => {
    const newProduction = {
      _id: chance.guid(),
      name,
      dateCreated: new Date(),
      entityType: entityTypes.PRODUCTION,
      items: []
    };

    //add in db
    const res = await epicDB.api.add(newProduction);
// debugger;
    //add in store
    this.productions.unshift(newProduction);
    // debugger;

    return newProduction;
  };

  @action
  updateProduction = async (production) => {
    const res = await epicDB.api.update(production);

    return production;
  };


  cloneProduction = async (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Clone: Cannot find production of Id ${productionId}`);

    const newProduction={};
    newProduction._id =  chance.guid();
    newProduction.name = production.name + ` (c)`;
    newProduction.items = production.items;
    newProduction.entityType = entityTypes.PRODUCTION;
    newProduction.dateCreated = new Date();

    await epicDB.api.add(newProduction);
    this.productions.unshift(newProduction);

    this.appStore.navigateToProduction(newProduction._id);
  };

  deleteProduction = (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Delete: Cannot find production of Id ${productionId}`);


    _.remove(this.productions, { _id: productionId });
    epicDB.api.remove(productionId);

    this.appStore.navigateToProduction(null);
  };

}