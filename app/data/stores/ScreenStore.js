import { observable, action } from "mobx";
import { BrowserWindow } from "electron";
import { setConfig } from "../persistence/localdb";
import { settings } from "../../utils/data";

const electron = require("electron").remote;
const path = electron.require("path");

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

    console.log({ opts });

    this.projectorWindow = new electron.BrowserWindow(opts);
    this.projectorWindow.loadURL(`file://${__dirname}/projector/projector.html`);
    this.projectorWindow.webContents.on("did-finish-load", () => {

      this.projectorWindow.show();
      // this.projectorWindow.maximize();
    });
    this.projectorWindow.on("closed", () => {
      this.projectorWindow = null;
    });
  };

  testProjector = (text) => {
    if (!this.projectorWindow) this.loadProjector();

    this.projectorWindow.webContents.send("toProjector", {
      action: "scene",
      nodes: [
        { type: "staticBackground", src: "" },
        { type: "videoBackground", src: "" },
        { type: "video", src: "", volume: 100, bounds: null }, // For anything but text, null bounds means full screen
        { type: "image", src: "", volume: 100, bounds: null },
        { type: "text", text: text || "Welcome to Church", bounds: { x: 30, y: 50, width: 40, height: 20 } }
      ]
    });
  };


}