import ScreenStore from "./ScreenStore";
import ProductionStore from "./ProductionStore";
import ElementStore from "./ElementStore";
import { observable, action } from "mobx";

class AppStore {

  @observable isBusy = false;
  history=null;

  constructor() {
    this.screenStore = new ScreenStore(this);
    this.productionStore = new ProductionStore(this);
    this.elementStore = new ElementStore(this);
  }


  setHistory = (history) => {
    this.history = history;
  };

  navigateToProduction = (productionId) => {
    if (!this.history) throw new Error("Cannot navigate: History not set");

    this.productionStore.setLastSelectedProduction(productionId);
    this.history.push("/productions/" + productionId);
  };

  navigateToElement = (elemId) => {
    if (!this.history) throw new Error("Cannot navigate: History not set");

    this.productionStore.setLastSelectedProduction(productionId);
    this.history.push("/elements/" + productionId);
  };

  @action
  showBusy(){
    this.isBusy = true;
  }

  @action
  hideBusy(){
    this.isBusy = false;
  }

}


export default new AppStore();