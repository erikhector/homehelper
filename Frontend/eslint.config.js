import eslintBaseConfig from "./eslint.config.base.js";

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  ...eslintBaseConfig
  // You can add project-specific ESLint configurations here. For example:
  //   {
  //     name: "Extended config",
  //     files: ["**/*.{js,ts,jsx,tsx}"],
  //     rules: {
  //         // Override or add a rule for this project
  //     }
  //   }
];
