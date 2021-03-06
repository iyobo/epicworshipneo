import { action, computed, observable } from "mobx";
import { settings, entityTypes, elementTypes } from "../../utils/data";
// import { find, getConfig, setConfig, upsert, remove } from "../persistence/localdb";
const electron = require("electron").remote;
const { find, getConfig, setConfig, upsert, remove } = require("./localdb");
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

    const liveSetting = await getConfig(settings.liveProductionId);
    if (liveSetting) this.setLiveProduction(liveSetting.value);

    // this.calculateProductionItems();
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


  makeProductionLive = async (productionId) => {
    const production = this.productionIndex[productionId];
    if (!production) throw new Error(`Live: Cannot find production of Id ${productionId}`);

    await setConfig(settings.liveProductionId, productionId);
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


  findProductionById = (id) => {
    return this.productionIndex[id];
  };

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

  @action
  addToLiveProduction = async (element) => {
    const liveProduction = this.liveProduction;
    // const liveProduction = this.productionIndex[this.liveProductionId];
    const item = { _id: chance.guid(), elementType: element.elementType, elementId: element._id };

    liveProduction.items.push(item);
    console.log(liveProduction);
  };

  @action
  removeFromLiveProduction = async (productionItemId) => {
    const liveProduction = this.liveProduction;
    _.remove(liveProduction.items, { _id: productionItemId });

    await upsert(liveProduction);

  };

  /**
   * A Scene Page is an object with {name, type, text, elementId, payload}.
   * Payload  gets thrown out to the projector for display
   * @returns {Array}
   */
  get liveProductionScenePages() {
    console.log("refreshing scene pages...", this);
    if (!this.liveProduction) return [];

    const scenePages = [];
    const elementStore = this.appStore.elementStore;

    this.liveProduction.items.forEach((it) => {
      const element = elementStore.getElement(it.elementType, it.elementId);
      if (!element) return;

      if (element.elementType === elementTypes.SONG) {
        const paragraphs = element.text.split("\n\n");
        paragraphs.forEach((paragraph) => {

          const paragraphText = paragraph.trim();
          const payload = {
            action: "replaceScene",
            nodes: [
              // { type: "video", src: "" }, // For anything but text, null bounds means full screen
              // { type: "image", src: "" },
              {
                type: "text",
                text: paragraphText.trim(),
                fontSize: 100,
                font: "Arial",
                color: "white",
                shadow: 2,
                shadowColor: "black",
                horizontalAlign: "center",
                verticalAlign: "center",
                bounds: { x: 100, width: 800, y: 100, height: 800 }
              },
              {
                type: "text",
                text: element.name,
                fontSize: 20,
                font: "Arial",
                color: "white",
                shadow: 1,
                shadowColor: "black",
                bounds: { x: 10, y: 950, width: 900, height: 50 }
              }
            ]
          };

          const scenePage = {
            _id: chance.guid(),
            name: element.name,
            elementType: element.elementType,
            elementId: element._id,
            text: paragraphText,
            payload
          };

          scenePages.push(scenePage);
        });

      }
      else if (element.elementType === elementTypes.BACKGROUND) {

        let bgNode= {};

        if(element.details.mime && ~element.details.mime.indexOf('video')){
          bgNode = { type: "video", src: element.details.path, loop: true, muted: true };
        }
        else{
          bgNode = { type: "image", src: element.details.path };
        }

        const scenePage = {
          _id: chance.guid(),
          name: element.name,
          text: element.name,
          elementType: element.elementType,
          elementId: element._id,
          payload: {
            action: "appendScene",
            nodes: [bgNode]
          }
        };
        scenePages.push(scenePage);

      }
      else if (element.elementType === elementTypes.MEDIA) {

        let bgNode= {};

        if(element.details.mime && ~element.details.mime.indexOf('video')){
          bgNode = { type: "video", src: element.details.path, loop: false, muted: false };
        }
        else{
          bgNode = { type: "image", src: element.details.path };
        }

        const scenePage = {
          _id: chance.guid(),
          name: element.name,
          text: element.name,
          elementType: element.elementType,
          elementId: element._id,
          payload: {
            action: "replaceScene",
            nodes: [bgNode]
          }
        };
        scenePages.push(scenePage);

      }

      // empty scene
      scenePages.push({
        _id: chance.guid(),
        payload: {
          action: "replaceScene",
          nodes: []
        }
      });

    });

    console.log({ scenePages });
    return scenePages;
  }

}

