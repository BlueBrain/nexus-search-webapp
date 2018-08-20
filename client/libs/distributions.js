import { getProp } from "@libs/utils";

export const getDistributionFromInstance = instance => {
  if (!instance) {
    return null;
  }
  let distro = getProp(instance, "distribution", [{}])[0];
  return getProp(distro, "downloadURL");
};
