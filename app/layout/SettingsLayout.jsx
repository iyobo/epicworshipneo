import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './SettingsLayout.scss';
import { inject, observer } from "mobx-react/index";

@inject('store')
@observer
export default class SettingsLayout extends Component {
  render() {
    return (
      <div className='settingsLayout uk-animation-slide-right-small'>
        <h2>Settings</h2>
      </div>
    );
  }
}
