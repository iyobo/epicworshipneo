import electron from 'electron';

let screens = []

export const initializeScreens = (app) =>{
  console.log('Initializing Message Pipes...');

  screens = electron.screen.getAllDisplays()

  console.log('screens defined.')
}