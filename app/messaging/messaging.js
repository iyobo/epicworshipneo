import electron from 'electron';

export const initializeMessaging = (app) =>{
  console.log('Initializing Message Pipes...');

  const screens = electron.screen.getAllDisplays()

  console.log('screens defined.')
}