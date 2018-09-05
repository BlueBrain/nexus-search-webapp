
import batchPromise from "batch-promise";

const asyncTick = () => {
  return new Promise(resolve => {
    process.nextTick(resolve);
  });
}

const promiseReduce = (funcs, startData) =>
  funcs.reduce(
    (promise, func) =>
      promise.then(result => Promise.all(result.map(doc => {
        return func(doc)
      }))),
    Promise.resolve(startData)
  );

const promiseBatch = (size, data, funcs) => {
  return batchPromises(size, data, dataEntry => new Promise((resolve, reject) => {
    return Promise.all(funcs.map(
      (func) => func(dataEntry)
    ))
    .then(resolve)
    .catch(reject)
  }));
}

export default async function waitForEach(promise, arrayOfThingsToDo) {
  try {
    let data = await promise;
    let transformedData = await promiseBatch(10, data, arrayOfThingsToDo);
    return transformedData;
  } catch (error) {
    throw error;
  }
}
