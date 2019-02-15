import ScreenStore from "./ScreenStore";

class AppStore {

  constructor(){
    this.screenStore = new ScreenStore(this);
  }



}


export default new AppStore();