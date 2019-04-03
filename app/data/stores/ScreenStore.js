import { observable, action } from "mobx"

export default class ScreenStore {

  @observable screens = [];

  constructor(appStore){
    this.appStore = appStore;
  }

  @action
  loadScreens = () =>{

  }



}