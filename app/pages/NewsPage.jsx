import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { T } from "../../i18n/i18n";

@inject("store")
@observer
export default class NewsPage extends Component {
  render() {
    return (
      <div className='uk-animation-slide-left-small'>
        <div className="uk-child-width-expand@s uk-text-center" data-uk-grid>
          <div>
            <T name='news_goTo'/> <Link to='/productions'>Productions</Link> <T name='news_toGetStarted'/>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body"><T name='news_comingSoon'/></div>
          </div>
        </div>
      </div>
    );
  }
}
