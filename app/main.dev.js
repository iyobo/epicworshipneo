/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */

import { initLogger, initSentry, installExtensions } from "./utils/bootstrap";
initSentry();
import { app, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";



import MenuBuilder from "./menu";

import { initializeScreens } from "./managers/screenManager";

initLogger();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;


if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === "development" ||
  process.env.DEBUG_PROD === "true"
) {
  require("electron-debug")();
}


/**
 * Add event listeners...
 */

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", async () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    await installExtensions();
  }

  // await initializeData(app);
  await initializeScreens(app);

  //Initialize data
  // await initializeData(app);

  mainWindow = new BrowserWindow({
    title: "EpicWorship: When you do, It must be Epic",
    show: false,
    width: 1200,
    height: 1000,
    x: 0,
    y: 0,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });

  //TODO: maybe use this?
  //win.loadURL(url.format({
  // pathname: path.join(__dirname, 'dist/index.html'),
  // protocol: 'file:',
  // slashes: true
  // }));
  // const mainWindowURL = `file://${__dirname}/projector/projector.html`;
  process.env.realAppBase = __dirname;
  const mainWindowURL = `file://${__dirname}/app.html`;
  console.error({mainWindowURL, dirBase: __dirname, eBase: app.getAppPath()});
  mainWindow.loadURL(mainWindowURL);

  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) mainWindow.webContents.openDevTools({ mode: "bottom" });

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on("did-finish-load", () => {
    // mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error("\"mainWindow\" is not defined");
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();

    }
  });


  // mainWindow.webContents.on('did-navigate-in-page', () => {
  //   if (!mainWindow) {
  //     throw new Error('"mainWindow" is not defined');
  //   }
  //   if (process.env.START_MINIMIZED) {
  //     mainWindow.minimize();
  //   } else {
  //     mainWindow.show();
  //     mainWindow.focus();
  //   }
  // });

  mainWindow.on("closed", () => {
    mainWindow = null;
    process.exit();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
