import ScreenStore from "./ScreenStore";
import ProductionStore from "./ProductionStore";
import ElementStore from "./ElementStore";
import { observable, action } from "mobx";

class AppStore {

  @observable busy = false;

  constructor(){
    this.screenStore = new ScreenStore(this);
    this.productionStore = new ProductionStore(this);
    this.elementStore = new ElementStore(this);
  }



}


export default new AppStore();