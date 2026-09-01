import path from "path";
import fs from "fs/promises";
import { createRequire } from "module";
import prettier from "prettier";
import { packagesToUninstall } from "../core/constants.js";

const require = createRequire(import.meta.url);

class WorkflowPackageJson {
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
    this.logger.setWorkflowName("Pkg json");
  }

  async execute() {
    this.logger.workflow("Starting package.json synchronization workflow");

    const targetPackageJson = require(path.join(this.service.context.paths.targetFrontend, "package.json"));
    const localPackageJson = require(path.join(this.service.context.paths.templateFrontendpath, "package.json"));
    const targetDevDepFiltered = this.#filterPackages(targetPackageJson.devDependencies);
    const targetDevDepComplete = this.#addAndSortDevDependencies(targetDevDepFiltered, localPackageJson.devDependencies);

    this.logger.info('Updating package.json and correcting "name" property to kebab-case format if needed.');
    let updatedPackageJson = {
      ...localPackageJson,
      name: this.#toKebabCase(targetPackageJson.name),
      devDependencies: targetDevDepComplete,
      dependencies: targetPackageJson.dependencies
    };

    this.logger.info("Formatting package.json with Prettier before writing to disk.");

    // Make sure the updated package.json file has same formatting as the original,
    // which usually has been formatted with prettier
    const prettierConfig = await prettier.resolveConfig("../../../Frontend/.prettierrc");
    const formatted = await prettier.format(JSON.stringify(updatedPackageJson), {
      parser: "json-stringify",
      ...prettierConfig
    });
    await fs.writeFile(path.join(this.service.context.paths.targetFrontend, "package.json"), formatted);
  }

  #filterPackages(deps) {
    return Object.fromEntries(Object.entries(deps || {}).filter(([key]) => !packagesToUninstall.includes(key)));
  }

  #addAndSortDevDependencies(targetDevDeps, localDevDeps) {
    const devDeps = { ...(targetDevDeps || {}) };

    // Add/overwrite each package from localDevDeps except excluded ones
    for (const pkg of Object.keys(localDevDeps || {})) {
      const exclude = ["eslint", "globals", "@types/react", "@types/react-dom"];
      if (!exclude.some((str) => pkg.toLowerCase().includes(str))) {
        devDeps[pkg] = localDevDeps[pkg];
      }
    }

    // Sort dependencies by key
    const sortedDevDeps = Object.fromEntries(Object.entries(devDeps).sort(([a], [b]) => a.localeCompare(b)));

    return sortedDevDeps;
  }

  /**
   * @example
   * toKebabCase("fooBar");  // "foo-bar"
   * toKebabCase("foo_bar"); // "foo-bar"
   */
  #toKebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2") // fooBar -> foo-Bar
      .replace(/[_\s]+/g, "-") // foo_bar or foo bar -> foo-bar
      .toLowerCase();
  }
}

export default WorkflowPackageJson;
