
/**
 * returns promises into array that can be pattern matched
 * https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
 *
 * @param {*} promise
 * @returns {Promise<array>}
 */
async function awaitTo (promise) {
  try {
    let data = await promise;
    return [null, data];
  } catch (error) {
    return [error];
  }
}

export const to = awaitTo;