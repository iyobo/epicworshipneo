import ScreenStore from "./ScreenStore";
import ProductionStore from "./ProductionStore";

class AppStore {

  constructor(){
    this.screenStore = new ScreenStore(this);
    this.productionStore = new ProductionStore(this);
  }



}


export default new AppStore();