
const asyncTick = () => {
  return new Promise(resolve => {
    process.nextTick(resolve);
  });
}

const promiseReduce = (funcs, startData) =>
  funcs.reduce(
    (promise, func) =>
      promise.then(result => Promise.all(result.map(doc => {
          return asyncTick()
          .then(() => {
            return func(doc)
          })
      }))),
    Promise.resolve(startData)
  );

export default async function waitForEach(promise, arrayOfThingsToDo) {
  try {
    let data = await promise;
    let transformedData = await promiseReduce(arrayOfThingsToDo, data);
    return transformedData;
  } catch (error) {
    throw error;
  }
}
