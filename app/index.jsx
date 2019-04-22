
import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
// import Root from "./layout/Root";
import "./app.global.scss";
import { initSentry } from "./utils/bootstrap";
initSentry();
const el = require('electron');
const electron = require("electron").remote;

const path = electron.require('path');
const os = electron.require('os');
const { initializeData, setConfig } = electron.require('filepouch');
const storageFolder = path.join(os.homedir(), 'epicworshipData');

(async function(){

  console.log({
    elTek: el.remote.app.getAppPath(),
    processCWD: process.cwd(),

  })

  await initializeData({storageFolder});

  const Root = require("./layout/Root").default;
  render(
    <AppContainer>
      <Root/>
    </AppContainer>,
    document.getElementById("root")
  );

  if (module.hot) {
    module.hot.accept("./layout/Root", () => {
      // eslint-disable-next-line global-require
      const NextRoot = require("./layout/Root").default;
      render(
        <AppContainer>
          <NextRoot/>
        </AppContainer>,
        document.getElementById("root")
      );
    });
  }


})();