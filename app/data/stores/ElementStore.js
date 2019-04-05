import { action, computed, observable } from "mobx";
import { elementTypes, entityTypes } from "../../utils/data";
import { find, findById, upsert } from "../persistence/localdb";

const _ = require("lodash");

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

    const docs = await find({ elementType }, [{ timestamp: "desc" }]);
    // debugger;
    // docs.sort(function(a, b) {
    //   return b.dateCreated - a.dateCreated;
    // });
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
  createElement = async (elementType, name, text) => {
    const newElement = {
      _id: chance.guid(),
      name,
      text,
      details: {},
      timestamp: Date.now(),
      createdTime: Date.now(),
      elementType,
      entityType: entityTypes.ELEMENT
    };

    //add in db
    const res = await upsert(newElement);

    //add in store
    this[elementType + "s"].unshift(newElement);

    toast.success({ message: `${elementType} "${name}" created` });
    return newElement;
  };

  @action
  updateElement = async (element) => {
    const res = await upsert(element);

    toast.success({ message: `${element.elementType} "${element.name}" updated` });
    return element;
  };

  getElement = (elementType, id) => {
    return this[elementType + "Map"][id];
  };

  findElement = async (id) => {
    return await findById(id);
  };

  @action
  cloneElement = async (elementType, id) => {
    const originalElement = this[elementType + "Map"][id];
    if (!originalElement) throw new Error(`Clone: Cannot find ${elementType} of Id ${id}`);

    const newElement = { elementType };
    newElement._id = chance.guid();
    newElement.name = originalElement.name + ` (c)`;
    newElement.text = originalElement.text;
    newElement.details = originalElement.details;
    newElement.entityType = entityTypes.ELEMENT;
    newElement.timestamp = Date.now();

    await upsert(newElement);
    this[elementType + "s"].unshift(newElement);

    toast.success({ message: `${elementType} "${newElement.name}" created` });
    this.appStore.navigateToElement(elementType, newElement._id);
  };

  @action
  deleteElement = async (elementType, id) => {

    const element = await findById(id);
    if (!element) throw new Error(`Delete: Cannot find ${elementType} of Id ${id}`);

    await remove(element._id);
    _.remove(this[elementType + "s"], { _id: id });

    toast.success({ message: `${elementType} "${element.name}" deleted` });

    this.appStore.navigateToElement(elementType, null);
  };

}