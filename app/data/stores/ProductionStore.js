import { action, computed, observable } from "mobx";
import { configTypes, entityTypes } from "../../utils/data";
import { find, getConfig, setConfig, upsert } from "../persistence/localdb";

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

    const docs = await find({
      entityType: entityTypes.PRODUCTION,
      timestamp: { $exists: true }
    }, [{ timestamp: "desc" }]);

    // docs.sort(function(a, b) {
    //   return b.dateCreated - a.dateCreated;
    // });
    this.productions = docs;

    const liveSetting = await getConfig(configTypes.liveProductionId);
    if (liveSetting) this.setLiveProduction(liveSetting.value);
  }

  //FIXME: Implement Full-text search. This is handled by List component for now
  async searchProductions(search) {

    // const {docs} = await db.db.find({
    //   selector: {
    //     entityType: entityTypes.PRODUCTION,
    //     name: { $regex: new RegExp(`.*${search}.*`) }
    //   },
    //   // sort: ["dateCreated"]
    // });
    // docs.sort(function(a, b) {
    //   return b.dateCreated - a.dateCreated;
    // });
    //
    // return docs;
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
    console.log("setting Live production", productionId);
    this.liveProductionId = productionId;
  };

  @computed get liveProductionItems() {
    const live = this.liveProduction;
    if (!live) return null;

    const items = [];
    const elementStore = this.appStore.elementStore;

    live.items.forEach((it) => {
      const element = elementStore.getElement(it.elementType, it.elementId);

      if (element) {
        const item = {
          _id: chance.guid(),
          name: element.name,
          element
        };

        items.push(item);
      }

    });


    return items;
  }

  makeProductionLive = async (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Live: Cannot find production of Id ${productionId}`);

    await setConfig(configTypes.liveProductionId, productionId);
    this.setLiveProduction(productionId);
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

  @action
  createProduction = async (name) => {
    const newProduction = {
      _id: chance.guid(),
      name,
      timestamp: Date.now(),
      entityType: entityTypes.PRODUCTION,
      items: []
    };

    //add in db
    await upsert(newProduction);

    //add in store
    this.productions.unshift(newProduction);

    toast.success({ message: `Production "${newProduction.name}" created` });

    return newProduction;
  };

  @action
  updateProduction = async (production) => {
    await upsert(production);

    toast.success({ message: `Production "${production.name}" updated` });

    return production;
  };


  cloneProduction = async (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Clone: Cannot find production of Id ${productionId}`);

    const newProduction = {};
    newProduction._id = chance.guid();
    newProduction.name = production.name + ` (c)`;
    newProduction.items = production.items;
    newProduction.entityType = entityTypes.PRODUCTION;
    newProduction.timestamp = Date.now();
    newProduction.createdTime = Date.now();

    await upsert(newProduction);
    this.productions.unshift(newProduction);

    toast.success({ message: `Production "${newProduction.name}" created` });

    this.appStore.navigateToProduction(newProduction._id);
  };

  deleteProduction = async (productionId) => {
    await remove(productionId);

    _.remove(this.productions, { _id: productionId });

    toast.success({ message: `Production "${production.name}" deleted` });

    this.appStore.navigateToProduction(null);
  };

  addToLiveProduction = async (element) => {
    const liveProduction = this.liveProduction;

    const item = { _id: chance.guid(), elementType: element.elementType, elementId: element._id };

    liveProduction.items.push(item);
    await upsert(liveProduction);

  };

}