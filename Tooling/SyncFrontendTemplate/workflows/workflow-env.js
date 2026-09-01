import path from "path";
import fs from "fs/promises";
import { run as jscodeshift } from "jscodeshift/src/Runner.js";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { config } from "dotenv";
import fastGlob from "fast-glob";
import { IGNORE_PATTERNS } from "../core/constants.js";

class WorkflowEnv {
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
    this.logger.setWorkflowName(".env sync");
  }

  async execute() {
    this.logger.workflow("Starting .env synchronization workflow");

    const searchAndReplaceSourceFiles = [
      `${this.service.context.paths.targetFrontend}/src/**/*/*.{tsx,ts}`,
      `${this.service.context.paths.targetFrontend}/src/*.{tsx,ts}`
    ];

    // Older webpack projects use process.env.*
    await this.service.searchReplace({
      files: searchAndReplaceSourceFiles,
      from: /process.env./g,
      to: "import.meta.env.",
      ignore: [...IGNORE_PATTERNS],
      allowEmptyPaths: true
    });

    // Fix values containing hash in .env files by wrapping them in quotes
    // Latest dotenv cant parse these values without quotes
    // Important to run before reading the .env files
    const hashValueRegex = /^([A-Za-z0-9_]+)=(?!["'])(.*#.*)$/gm;
    await this.service.searchReplace({
      files: [`${this.service.context.paths.targetFrontend}/.env*`],
      from: hashValueRegex,
      to: '$1="$2"',
      ignore: [...IGNORE_PATTERNS]
    });

    const dotenvSettingsGlobal = config({ path: path.join(this.service.context.paths.targetFrontend, ".env"), quiet: true }).parsed;
    const dotenvSettingsDev = config({ path: path.join(this.service.context.paths.targetFrontend, ".env.development"), quiet: true }).parsed;
    const dotenvSettingsProd = config({ path: path.join(this.service.context.paths.targetFrontend, ".env.production"), quiet: true }).parsed;

    const isWebpackProject = Boolean(dotenvSettingsDev.WP_BROWSER);

    if (isWebpackProject) {
      this.logger.info(`Is a webpack project. Migrating and synchronizing .env files for vite template ${this.service.context.paths.targetFrontend}`);
      // await deleteFile(path.join(this.service.context.paths.targetFrontend, ".env.development"));
      // await deleteFile(path.join(this.service.context.paths.targetFrontend, ".env.production"));
      await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, ".env.local"));

      await this.service.copySameFile(path.join("Frontend", ".env.development"));
      await this.service.copySameFile(path.join("Frontend", ".env"));
      await this.service.copySameFile(path.join("Frontend", ".env.production"));

      // UPDATE .env.development
      if (dotenvSettingsDev.WP_BACKEND_DEV_URL) {
        this.#updateEnvFile(
          path.join(this.service.context.paths.targetFrontend, ".env.development"),
          "CONFIG_PROXY_URL",
          dotenvSettingsDev.WP_BACKEND_DEV_URL
        );
      }

      // Get a list of all settings that do not start with "WP_"
      const nonWPSettingsDev = Object.keys(dotenvSettingsDev)
        .filter((key) => !key.startsWith("WP_") && key !== "REACT_AXE")
        .map((key) => ({ key, value: dotenvSettingsDev[key] }));

      nonWPSettingsDev.forEach(({ key, value }) => {
        this.#updateEnvFile(path.join(this.service.context.paths.targetFrontend, ".env.development"), `VITE_${key}`, value);
      });

      // UPDATE .env
      const nonWPSettingsGlobal = Object.keys(dotenvSettingsGlobal)
        .filter((key) => !key.startsWith("WP_") && key !== "REACT_AXE")
        .map((key) => ({ key, value: dotenvSettingsGlobal[key] }));

      nonWPSettingsGlobal.forEach(({ key, value }) => {
        this.#updateEnvFile(path.join(this.service.context.paths.targetFrontend, ".env"), `VITE_${key}`, value);
      });

      if (dotenvSettingsGlobal.WP_LANG) {
        this.#updateEnvFile(path.join(this.service.context.paths.targetFrontend, ".env"), "VITE_APP_LANG", dotenvSettingsGlobal.WP_LANG);
      }
      if (dotenvSettingsGlobal.WP_TITLE) {
        this.#updateEnvFile(path.join(this.service.context.paths.targetFrontend, ".env"), "VITE_APP_TITLE", dotenvSettingsGlobal.WP_TITLE);
      }

      // UPDATE .env.production
      const nonWPSettingsProd = Object.keys(dotenvSettingsProd)
        .filter((key) => !key.startsWith("WP_") && key !== "REACT_AXE")
        .map((key) => ({ key, value: dotenvSettingsProd[key] }));

      nonWPSettingsProd.forEach(({ key, value }) => {
        const safeValue = value.includes("#") ? `"${value}"` : value;
        this.#updateEnvFile(path.join(this.service.context.paths.targetFrontend, ".env.production"), `VITE_${key}`, safeValue);
      });

      this.logger.info("Search and replace import.meta.env.* variables in source code");

      const importMetaEnvVars = await this.#collectImportMetaEnvVars(this.service.context.paths.targetFrontend);
      const importMetaEnvVarsSearchReplace = importMetaEnvVars.map((varName) => {
        if (varName === "WP_TITLE") {
          return {
            from: /import.meta.env.WP_TITLE/g,
            to: "import.meta.env.VITE_APP_TITLE"
          };
        }

        if (varName === "WP_LANG") {
          return {
            from: /import.meta.env.WP_LANG/g,
            to: "import.meta.env.VITE_APP_LANG"
          };
        }

        if (varName === "NODE_ENV") {
          return {
            from: /import.meta.env.NODE_ENV/g,
            to: "import.meta.env.MODE"
          };
        }

        const regex = new RegExp(`import\\.meta\\.env\\.(${varName})`, "g");

        return {
          from: regex,
          to: `import.meta.env.VITE_${varName}`
        };
      });

      for (const item of importMetaEnvVarsSearchReplace) {
        await this.service.searchReplace({
          files: searchAndReplaceSourceFiles,
          from: item.from,
          to: item.to,
          ignore: [...IGNORE_PATTERNS],
          allowEmptyPaths: true
        });
      }

      this.logger.info("Updating Globals.d.ts with import.meta.env variables");
      const globalsDtsPath = path.join(this.service.context.paths.targetFrontend, "src", "interfaces", "Globals.d.ts");
      if (!existsSync(globalsDtsPath)) {
        // Create new file
        this.logger.info(`Creating new Globals.d.ts file at ${globalsDtsPath}`);
        // openSync(globalsDtsPath, "w");
        writeFileSync(globalsDtsPath, "");
      }

      const transformPath = path.resolve("./codemods/codemod-import-meta-env.js");
      const paths = [globalsDtsPath];
      const options = {
        // dry: true,
        // print: true,
        // verbose: 1,
        failOnError: true,
        envVars: importMetaEnvVarsSearchReplace
        // ...
      };

      try {
        const res = await jscodeshift(transformPath, paths, options);
        // console.log(res);
        this.logger.info("Codemod for Globals.d.ts completed successfully");
      } catch (error) {
        this.logger.error("jscodeshift exception", error.message);
      }
    } else {
      this.logger.info(`The project at ${this.service.context.paths.targetFrontend} is not a Webpack project. Skipping .env file synchronization.`);
    }
  }

  /**
   * Update or add a key-value pair in an .env file
   * @param {string} filePath - Absolute path to .env file
   * @param {string} key - Environment variable name
   * @param {string} newValue - New value
   */
  #updateEnvFile(filePath, key, newValue) {
    // Read file (if it doesn't exist, create an empty one)
    let content = "";
    if (existsSync(filePath)) {
      content = readFileSync(filePath, "utf8");
    }

    const lines = content.split(/\r?\n/);
    let found = false;

    // Loop through lines and update in-place
    const updatedLines = lines.map((line) => {
      // Ignore comments or empty lines
      if (line.trim().startsWith("#") || !line.includes("=")) {
        return line;
      }

      const [k, ...rest] = line.split("=");
      if (k.trim() === key) {
        found = true;
        return `${key}=${newValue}`;
      }
      return line;
    });

    // If the key wasn't found, append it
    if (!found) {
      updatedLines.push(`${key}=${newValue}`);
    }

    // Write back to the file
    writeFileSync(filePath, updatedLines.join("\n"), "utf8");

    this.logger.info(`Updated env var in ${path.basename(filePath)}: ${key}=${newValue}`);
  }

  /**
   * Collect all import.meta.env.* variables used in source code
   * @param {string} root - Root directory to search
   * @returns {Promise<string[]>} Array of variable names
   */
  async #collectImportMetaEnvVars(root) {
    const files = await fastGlob(["src/**/*.{ts,tsx,js,jsx}"], { cwd: root, absolute: true });
    const pattern = /import\.meta\.env\.([A-Za-z0-9_]+)/g;
    const vars = new Set();

    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      let match;
      while ((match = pattern.exec(content)) !== null) {
        vars.add(match[1]);
      }
    }

    return Array.from(vars).sort();
  }
}

export default WorkflowEnv;
