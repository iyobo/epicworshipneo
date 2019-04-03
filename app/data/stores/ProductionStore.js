import { action, computed, observable } from "mobx";
import { entityTypes } from "../../utils/data";
import { db, setConfig} from "../persistence/Database";
import { configs } from "../persistence/models/Setting";

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

    const docs = await db.productions.find().sort('timestamp').exec();

    // docs.sort(function(a, b) {
    //   return b.dateCreated - a.dateCreated;
    // });
    this.productions = docs;

    const liveSetting = await db.settings.findOne({id: configs.liveProductionId}).exec();
    if(liveSetting) this.setLiveProduction(liveSetting.value);
  }

  //FIXME: fix this
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
      map[it.id] = it;
    });

    return map;
  }

  @action
  setLiveProduction = (productionId) => {
    console.log('setting Live production', productionId)
    this.liveProductionId = productionId;
  };

  makeProductionLive = async (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Live: Cannot find production of Id ${productionId}`);

    await setConfig(configs.liveProductionId,productionId);
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
      id: chance.guid(),
      name,
      timestamp: Date.now(),
      entityType: entityTypes.PRODUCTION,
      items: []
    };

    //add in db
    await db.productions.atomicUpsert(newProduction);

    //add in store
    this.productions.unshift(newProduction);

    toast.success({message: `Production "${newProduction.name}" created`});

    return newProduction;
  };

  @action
  updateProduction = async (production) => {
    await db.productions.atomicUpsert(production);

    toast.success({message: `Production "${production.name}" updated`});

    return production;
  };


  cloneProduction = async (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Clone: Cannot find production of Id ${productionId}`);

    const newProduction={};
    newProduction.id =  chance.guid();
    newProduction.name = production.name + ` (c)`;
    newProduction.items = production.items;
    newProduction.entityType = entityTypes.PRODUCTION;
    newProduction.timestamp = Date.now();
    newProduction.createdTime = Date.now();

    await db.productions.atomicUpsert(newProduction);
    this.productions.unshift(newProduction);

    toast.success({message: `Production "${newProduction.name}" created`});

    this.appStore.navigateToProduction(newProduction.id);
  };

  deleteProduction = async (productionId) => {
    const production = await db.productions.findOne({id:productionId}).exec();
    if (!production) throw new Error(`Delete: Cannot find production of Id ${productionId}`);


    await production.remove();
    _.remove(this.productions, { id: productionId });

    toast.success({message: `Production "${production.name}" deleted`});

    this.appStore.navigateToProduction(null);
  };

}