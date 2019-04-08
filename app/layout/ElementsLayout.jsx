import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { NavLink, Route, Switch } from "react-router-dom";
import ScripturePage from "../pages/elements/ScripturePage";
import MediaPage from "../pages/elements/MediaPage";
import BackgroundsPage from "../pages/elements/BackgroundsPage";
import AnnouncementsPage from "../pages/elements/AnnouncementsPage";
import PresentationsPage from "../pages/elements/PresentationsPage";
import { dict, T } from "../../i18n/i18n";
import { Redirect } from "react-router";
import SongsPage from "../pages/elements/songs/SongsPage";
import SidePanel from "../components/SidePanel";
import type { TSideBarButton } from "../components/SidePanel";

@inject("store")
@observer
export default class ElementsLayout extends Component {
  productionItemButtons: array<TSideBarButton> = [
    {
      icon: "trash",
      tooltip: dict.element_tooltip_delete_prodItem,
      handler: this.onRemoveProductionItem,
      showOnlyIfSelected: true
    }
  ];

  constructor(props){
    super(props)
  }

  onRemoveProductionItem = async (item) => {
    const prodStore = this.props.store.productionStore;
    const selectedProdId = this.getSelectedId();

    await prodStore.removeFromLiveProduction(item);
  };

  render() {

    const liveProduction = this.props.store.productionStore.liveProduction;

    // console.log({liveProduction})

    return (
      <div className='uk-animation-slide-right-small'>

        <ul className="uk-subnav uk-subnav-pill uk-animation-slide-top-small">
          <li><NavLink to="/elements/song"><i className='fa fa-music'/> <T name='menu_songs'/></NavLink></li>
          <li><NavLink to="/elements/scripture"><i className='fa fa-bible'/> <T name='menu_scripture'/></NavLink></li>
          <li><NavLink to="/elements/media"><i className='fa fa-play-circle'/> <T name='menu_media'/></NavLink></li>
          <li><NavLink to="/elements/backgrounds"><i className='fa fa-image'/> <T name='menu_backgrounds'/></NavLink>
          </li>
          <li><NavLink to="/elements/announcements"><i className='fa fa-bullhorn'/> <T
            name='menu_announcements'/></NavLink></li>
          <li><NavLink to="/elements/presentations"><i className='fa fa-magic'/> <T
            name='menu_presentations'/></NavLink></li>

        </ul>
        {/*Order of routes is important*/}
        <div className='elementsBody flexContainer'>
          <Switch>

            <Route exact path="/elements/song/:id" component={SongsPage}/>
            <Route path="/elements/song" component={SongsPage}/>

            <Route exact path="/elements/scripture/:id" component={ScripturePage}/>
            <Route path="/elements/scripture" component={ScripturePage}/>

            <Route exact path="/elements/media/:id" component={MediaPage}/>
            <Route path="/elements/media" component={MediaPage}/>

            <Route exact path="/elements/background/:id" component={BackgroundsPage}/>
            <Route path="/elements/background" component={BackgroundsPage}/>

            <Route exact path="/elements/announcement/:id" component={AnnouncementsPage}/>
            <Route path="/elements/announcement" component={AnnouncementsPage}/>

            <Route exact path="/elements/presentation/:id" component={PresentationsPage}/>
            <Route path="/elements/presentation" component={PresentationsPage}/>

            <Redirect to='/elements/song'/>

          </Switch>
          {liveProduction &&
          <div>
            <h3>Production Set</h3>
            <SidePanel
              items={liveProduction.items}
              expand
              // selectedId={selectedElementId}
              buttons={this.productionItemButtons}
              expandElements={true}
              // onItemClick={(item) => this.onItemSelect(item)}

            />
          </div>
          }
        </div>

      </div>
    );
  }
}
