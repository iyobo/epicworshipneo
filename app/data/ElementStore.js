import { observable, action, computed } from "mobx";

export default class ElementStore {

  // @observable songs = [];
  // @observable videos = [];
  // @observable audios = [];
  // @observable images = [];
  // @observable videoBackgrounds = [];
  // @observable imageBackgrounds = [];
  // @observable scriptures = [];

  @observable elementHash={};
  @observable elements=[];

  constructor(appStore){
    this.appStore = appStore;
  }

  @computed
  get songs(){

  }


}