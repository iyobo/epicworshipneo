import { observable, action, computed } from "mobx";
import { elementTypes } from "../utils/data";
import { epicDB } from "./localdb";

const chance = new require("chance")();

export default class ElementStore {

  @observable songs = [];
  @observable scriptures = [];
  @observable medias = [];
  @observable backgrounds = [];
  @observable announcements = [];
  @observable presentations = [];

  // @observable elementHash = {};
  // @observable elements = [];

  constructor(appStore) {
    this.appStore = appStore;

    //load elements
    this._loadElementsFromDB(elementTypes.SONG);
    this._loadElementsFromDB(elementTypes.SCRIPTURE);
    this._loadElementsFromDB(elementTypes.MEDIA);
    this._loadElementsFromDB(elementTypes.BACKGROUND);
    this._loadElementsFromDB(elementTypes.ANNOUNCEMENT);
    this._loadElementsFromDB(elementTypes.PRESENTATION);
  }

  async _loadElementsFromDB(elementType) {

    const { docs } = await epicDB.db.find({
      selector: {
        elementType
        // dateCreated: { $exists: true }
      }
      // use_index: ["entityListIdx"],
      // sort: ["dateCreated"]
    });
    // debugger;
    docs.sort(function(a, b) {
      return b.dateCreated - a.dateCreated;
    });
    this[elementType + "s"] = docs;
  }

  @computed
  get songMap() {
    const map = {};

    this.songs.forEach((it) => {
      map[it._id] = it;
    });

    return map;
  }

  @computed
  get scriptureMap() {
    const map = {};

    this.scriptures.forEach((it) => {
      map[it._id] = it;
    });

    return map;
  }

  @computed
  get mediaMap() {
    const map = {};

    this.medias.forEach((it) => {
      map[it._id] = it;
    });

    return map;
  }

  @computed
  get backgroundMap() {
    const map = {};

    this.backgrounds.forEach((it) => {
      map[it._id] = it;
    });

    return map;
  }

  @computed
  get announcementMap() {
    const map = {};

    this.announcements.forEach((it) => {
      map[it._id] = it;
    });

    return map;
  }

  @computed
  get presentationMap() {
    const map = {};

    this.presentations.forEach((it) => {
      map[it._id] = it;
    });

    return map;
  }


  @action
  createElement = async (elementType, name, content) => {
    const newElement = {
      _id: chance.guid(),
      name,
      content,
      dateCreated: new Date(),
      elementType,
      items: [] // {_id: chance.guid(), elementId}
    };

    //add in db
    const res = await epicDB.api.add(newElement);

    //add in store
    this[elementType + "s"].unshift(newElement);

    return newElement;
  };

  getElement = async (elementType, id) => {
    return this[elementType + "Map"][id];
  };

  @action
  cloneElement = async (elementType, id) => {
    const originalElement = this[elementType + "Map"][id];
    if (!originalElement) throw new Error(`Clone: Cannot find ${elementType} of Id ${id}`);

    const newElement = _.cloneDeep(originalElement);
    newElement._id = chance.guid();
    newElement.name += " clone " + new Date().toLocaleTimeString();
    newElement.dateCreated = new Date();

    this[elementType + "s"].unshift(newElement);
    await epicDB.api.add(newElement);

    this.appStore.navigateToElement(elementType, newElement._id);
  };

  @action
  deleteElement = async (elementType, id) => {
    const element = this[elementType + "Map"][id];
    if (!element) throw new Error(`Delete: Cannot find ${elementType}  of Id ${id}`);

    _.remove(this[elementType + "s"], { _id: id });
    await epicDB.api.remove(id);

    this.appStore.navigateToElement(elementType, null);
  };

}