export default async function to (promise) {
  try {
    let data = await promise;
    return [null, data];
  } catch (error) {
    return [error];
  }
};