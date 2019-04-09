import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
// import Root from "./layout/Root";
import "./app.global.scss";
import { initializeData } from "./data/persistence/localdb";


const el = require('electron');


(async function(){

  console.log({
    elTek: el.remote.app.getAppPath(),
    processCWD: process.cwd(),

  })

  await initializeData();

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