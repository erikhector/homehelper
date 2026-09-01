import knipConfigBase from "./knip.config.base.js";

/** @type {import("knip").KnipConfig} */
export default {
  entry: [...knipConfigBase.entry],
  project: [...knipConfigBase.project],
  ignore: [...knipConfigBase.ignore],
  ignoreBinaries: [...knipConfigBase.ignoreBinaries],
  ignoreDependencies: [...knipConfigBase.ignoreDependencies],
  paths: {
    ...knipConfigBase.paths
  }
};
