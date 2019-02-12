import ScreenStore from "./ScreenStore";

export default class AppStore {

  constructor(){
    this.screenStore = new ScreenStore(this);
  }



}