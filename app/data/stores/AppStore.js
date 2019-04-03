import ScreenStore from "./ScreenStore";
import ProductionStore from "./ProductionStore";
import ElementStore from "./ElementStore";
import { observable, action } from "mobx";
import { elementTypes } from "../../utils/data";

class AppStore {

  @observable isBusy = false;
  history = null;

  constructor() {
    this.screenStore = new ScreenStore(this);
    this.productionStore = new ProductionStore(this);
    this.elementStore = new ElementStore(this);
  }


  setHistory = (history) => {
    this.history = history;
  };

  navigateToProduction = (productionId) => {
    this.navigateToElement(elementTypes.PRODUCTION, productionId);
  };

  navigateToElement = (elementType, id) => {
    if (!this.history) throw new Error("Cannot navigate: History not set");

    if (elementType === elementTypes.PRODUCTION) {
      this.productionStore.setLastSelectedProduction(id);
      this.history.push(`/productions/${id}`);
    } else {
      console.log('nacing to ',elementType,id)
      this.history.push(`/elements/${elementType}/${id}`);
    }

  };

  @action
  showBusy() {
    this.isBusy = true;
  }

  @action
  hideBusy() {
    this.isBusy = false;
  }

}


export default new AppStore();