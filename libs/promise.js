export const makeCancelable = promise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

export const to = async function to(promise) {
  try {
    let data = await promise;
    return [null, data];
  } catch (error) {
    return [error];
  }
};

export const asyncTimeout = timeInMS => {
  return new Promise(resolve => setTimeout(resolve, timeInMS));
};

export const asyncTick = () => {
  return new Promise(resolve => {
    process.nextTick(resolve);
  });
};

export const promiseReduce = (funcs, startData) =>
  funcs.reduce(
    (promise, func) =>
      promise.then(result =>
        Promise.all(
          result.map(doc => {
            return asyncTick().then(() => {
              return func(doc);
            });
          })
        )
      ),
    Promise.resolve(startData)
  );

export const waitForEach = async function waitForEach(
  promise,
  arrayOfThingsToDo
) {
  try {
    let data = await promise;
    let transformedData = await promiseReduce(arrayOfThingsToDo, data);
    return transformedData;
  } catch (error) {
    throw error;
  }
};
