/**
 * Generate a random integer
 *
 * @param  {number} min Minimum boundary
 * @param  {number} max Maximum boundary
 * @return {number}     Generated integer
 */
export function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomFloat (minValue, maxValue, precision = 2) {
  return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision))
}