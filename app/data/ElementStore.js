import { observable, action } from "mobx"

export default class ElementStore {

  @observable songs = [];
  @observable videos = [];
  @observable audios = [];
  @observable images = [];
  @observable videoBackgrounds = [];
  @observable imageBackgrounds = [];
  @observable scriptures = [];

  constructor(appStore){
    this.appStore = appStore;
  }

  // @action
  // loadScreens = () =>{
  //
  // }



}