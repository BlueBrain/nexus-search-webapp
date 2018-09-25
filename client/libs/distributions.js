import { getProp } from "@libs/utils";

export const getDistributionFromInstance = instance => {
  if (!instance) {
    return null;
  }
  // TODO: refactor after demo
  // Check if v0 or v1
  let distro = getProp(instance, "distribution", [])[0] || getProp(instance, '_distribution', [{}])[0];
  return getProp(distro, "downloadURL") || getProp(distro, '_downloadURL');
};
