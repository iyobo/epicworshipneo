/**
 * Converts a proxy to a normal object.
 * @param proxyParam
 */
export const proxyToObject = (proxyParam)=>{
  const obj = {};
  const keys = Object.getOwnPropertyNames(proxyParam);

  console.log('proxyToObject', keys)

  keys.forEach(key=>{
    obj[key] = proxyParam[key]
  });
  return obj;
}