import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { dict } from "../../../../i18n/i18n";
import type { TSideBarButton } from "../../../components/ItemList";
import ItemList from "../../../components/ItemList";
import { elementTypes } from "../../../utils/data";

const elementType = elementTypes.BACKGROUND;

type BackgroundComponentType = {
  selectedId: string,

}

@inject("store")
@observer
export default class BackgroundsComponent extends Component<BackgroundComponentType> {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: null
    };
  }

  /**
   * TODO: Open a file picker and import
   * @returns {Promise<void>}
   */
  onCreate = async () => {
    // this.props.store.navigateToElement(elementType, "new");
    await this.props.store.elementStore.importMediaElement(elementType);

  };

  onItemClick = (item) => {
    this.props.store.navigateToElement(elementType, item._id);
  };
  onItemDoubleClick = (item) => {
    this.props.store.navigateToElement(elementType, item._id);
    this.props.store.productionStore.addToLiveProduction(item);
  };

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {

    // this.props.store.elementStore.setLastSelectedProduction(nextProps.match.params.id);
  }

  getSelectedId() {
    return this.state.selectedId || this.props.selectedId;
  }

  componentDidCatch(error) {
    toast.error({ title: "Oops", message: error.message });
  }

  onDelete = async () => {
    const store = this.props.store.elementStore;
    const selectedElementId = this.getSelectedId();

    await store.deleteElement(elementType, selectedElementId);
  };

  onAddToProduction = async () => {
    const productionStore = this.props.store.productionStore;
    const selectedElementId = this.getSelectedId();

    const elementStore = this.props.store.elementStore;
    const element = await elementStore.findElement(selectedElementId);
    await productionStore.addToLiveProduction(element);
  };

  buttons: array<TSideBarButton> = [
    { icon: "plus", tooltip: dict._('tooltip_create',{elementType}), handler: this.onCreate },
    { icon: "trash", tooltip: dict._('tooltip_delete',{elementType}), handler: this.onDelete, showOnlyIfSelected: true },
    { icon: "chevron-right", tooltip: dict.toProduction, handler: this.onAddToProduction, showOnlyIfSelected: true }
  ];

  render() {
    const elementStore = this.props.store.elementStore;
    const selectedElementId = this.getSelectedId();
    const selectedElement = elementStore.getElement(elementType, selectedElementId);

    let PreviewPane = <div>{dict.background_page_instructions}</div>;

    if(selectedElement){
      if(selectedElement.details && selectedElement.details.mime.startsWith('image')){
        PreviewPane = <div>
          <h3 className='hardWrap'>{selectedElement.name}</h3>
          <img src={selectedElement.details.path} width='100%' />
        </div>
      }
      else {
        PreviewPane = <div>
          <h3 className='hardWrap'>{selectedElement.name}</h3>
          <video width="100%" height="400" controls src={selectedElement.details.path}/>
        </div>
      }
    }

    // debugger;
    return (
      <div className='uk-animation-slide-right-small'>
        <h2>{dict.menu_backgrounds}</h2>

        <div className='flexContainer'>
          <ItemList items={elementStore[elementType + "s"]}
                    selectedId={selectedElementId}
                    enableSearch={true}
                    buttons={this.buttons}
                    stretch
                    onItemClick={this.onItemClick}
                    onItemDoubleClick={this.onItemDoubleClick}
          />

          <div className='uk-animation-slide-right-small ' style={{maxWidth: '40vw'}}>
            {PreviewPane}
          </div>
        </div>
      </div>
    );
  }
}
