export const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};


export const initLogger = () => {

  ["log", "warn", "error"].forEach((methodName) => {
    const originalMethod = console[methodName];
    console[methodName] = (...args) => {
      let initiator = "unknown place";
      const timestamp = new Date().toISOString();
      try {
        throw new Error();
      } catch (e) {
        if (typeof e.stack === "string") {
          let isFirst = true;
          for (const line of e.stack.split("\n")) {
            const matches = line.match(/^\s+at\s+(.*)/);
            if (matches) {
              if (!isFirst) { // first line - current function
                // second line - caller (what we are looking for)
                initiator = matches[1];
                break;
              }
              isFirst = false;
            }
          }
        }
      }
      originalMethod.apply(console, [...args, "\n ", `[${timestamp}] @ ${initiator}`]);
    };
  });

};


export const initSentry = ()=> {
  const Sentry = require('@sentry/electron');
  Sentry.init({ dsn: 'https://8a81eeb019fa4233a8ce3f2835129b4f@sentry.io/1443354' });
}