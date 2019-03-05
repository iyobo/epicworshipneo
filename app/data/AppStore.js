import ScreenStore from "./ScreenStore";
import ProductionStore from "./ProductionStore";
import ElementStore from "./ElementStore";
import { observable } from "mobx";

class AppStore {

  @observable busy = false;
  history;

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

}


export default new AppStore();