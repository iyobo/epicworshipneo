import { observable, action } from "mobx";
import { BrowserWindow } from "electron";

const electron = require("electron").remote;
const process = electron.getGlobal("process");

// import { setConfig } from "../persistence/localdb";
const { setConfig } = electron.require(`${global.APPBASE}/localdb`);

import { settings } from "../../utils/data";

const path = electron.require("path");
const chance = new require("chance")();

export default class ScreenStore {

  @observable screens = [];
  @observable projectorScreen = null;

  projectorWindow = null;

  constructor(appStore) {
    this.appStore = appStore;
    this.loadScreens();
  }

  /**
   * FIXME: Using this to auto-pick screen to project to.
   */
  @action
  loadScreens = async () => {
    this.screens = electron.screen.getAllDisplays();

    //For now, just always use the last screen to display projector
    this.projectorScreen = this.screens[this.screens.length - 1];

    await setConfig(settings.projectorScreenId, this.projectorScreen.id);
    this.loadProjector();
  };

  @action
  loadProjector = () => {

    if (this.projectorWindow) return;

    const opts = {
      title: "EpicWorship Projector",
      show: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true
      },
      ...this.projectorScreen.bounds
    };

    // const url = `file://${__dirname}/projector/projector.html`;
    const url = `file://${process.env.realAppBase}/projector/projector.html`;
    console.log({ url, opts, __filename, __dirname, env: process.env });

    this.projectorWindow = new electron.BrowserWindow(opts);
    this.projectorWindow.loadURL(url);


    this.projectorWindow.webContents.on("did-finish-load", () => {

      this.projectorWindow.show();
      // this.projectorWindow.maximize();

      // if (
      //   process.env.NODE_ENV === "development" ||
      //   process.env.DEBUG_PROD === "true"
      // )
      this.projectorWindow.webContents.openDevTools({ mode: "bottom" });
    });
    this.projectorWindow.on("closed", () => {
      this.projectorWindow = null;
    });
  };

  /**
   * projectorName not used right now as we currently only do one.
   * @param projectorName
   * @param payload
   */
  sendtoProjector = (projectorName, payload) => {
    if (!this.projectorWindow) this.loadProjector();

    this.projectorWindow.webContents.send("toProjector", payload);
  };

  testText = (text) => {
    if (!this.projectorWindow) this.loadProjector();

    this.projectorWindow.webContents.send("toProjector", {
      action: "replaceScene",
      nodes: [
        // { type: "staticBackground", src: "bg.jpg" },
        // { type: "videoBackground", src: "" },
        // { type: "video", src: "", volume: 100, bounds: null, mime: "video/mp4" }, // For anything but text, null bounds means full screen
        // { type: "image", src: "", volume: 100, bounds: null },
        {
          type: "text",
          text: text || "Welcome \nto Church " + chance.name() + ". \nHow can I help you?\nWill you be alright?\nOmni flex 2345 the revolutionary something that became legendary all on it's own.",
          fontSize: 100,
          font: "Arial",
          color: "white",
          shadow: 1,
          shadowColor: "black",
          textAlign: "center",

          bounds: { x: 200, width: 600, y: 100, height: 800 }
        }
      ]
    });
  };

  testStaticBackground1 = () => {
    if (!this.projectorWindow) this.loadProjector();

    this.projectorWindow.webContents.send("toProjector", {
      action: "appendScene",
      nodes: [
        { type: "staticBackground", src: "bg.jpg" }
        // { type: "videoBackground", src: "" },

      ]
    });
  };

  testStaticBackground2 = () => {
    if (!this.projectorWindow) this.loadProjector();

    this.projectorWindow.webContents.send("toProjector", {
      action: "appendScene",
      nodes: [
        { type: "staticBackground", src: "10205.jpg" }
        // { type: "videoBackground", src: "" },

      ]
    });
  };

  testMotionBackground1 = () => {
    if (!this.projectorWindow) this.loadProjector();

    this.projectorWindow.webContents.send("toProjector", {
      action: "appendScene",
      nodes: [
        // { type: "staticBackground", src: "bg.jpg" },
        { type: "videoBackground", src: "bg1.mp4" }

      ]
    });
  };

  testMotionBackground2 = () => {
    if (!this.projectorWindow) this.loadProjector();

    this.projectorWindow.webContents.send("toProjector", {
      action: "appendScene",
      nodes: [
        // { type: "staticBackground", src: "bg.jpg" },
        { type: "videoBackground", src: "bg2.mp4" }

      ]
    });
  };


}