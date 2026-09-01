import path from "path";
import fs from "fs/promises";
import { run as jscodeshift } from "jscodeshift/src/Runner.js";
import { existsSync } from "fs";
import { IGNORE_PATTERNS } from "../core/constants.js";

class WorkflowCorrectness {
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
    this.logger.setWorkflowName("Correctness");
  }

  async execute() {
    this.logger.workflow("Starting cleanup workflow");

    const rootTsxPath = path.join(this.service.context.paths.targetFrontend, "src", "Root.tsx");
    const hasRootTsx = existsSync(rootTsxPath);
    const hasAppTsx = existsSync(path.join(this.service.context.paths.targetFrontend, "src", "App.tsx"));

    if (hasRootTsx && !hasAppTsx) {
      // The codemod cannot parse Root.tsx if the type assertion is present.
      // So we first remove it via search and replace.
      await this.service.searchReplace({
        files: [rootTsxPath],
        from: 'document.querySelector("#root") as HTMLElement',
        to: 'document.querySelector("#root")',
        ignore: [...IGNORE_PATTERNS],
        allowEmptyPaths: true
      });

      const transformPath = path.resolve("./codemods/codemod-root-file.js");
      const paths = [rootTsxPath];
      const options = {
        // dry: true,
        // print: true,
        // verbose: 1,
        failOnError: true
        // ...
      };

      try {
        const res = await jscodeshift(transformPath, paths, options);
        // console.log(res);
        this.logger.info("Codemod for Root.tsx completed successfully");
      } catch (error) {
        this.logger.error("jscodeshift exception", error.message);
      }

      await fs.rename(
        path.join(this.service.context.paths.targetFrontend, "src", "Root.tsx"),
        path.join(this.service.context.paths.targetFrontend, "src", "App.tsx")
      );
    }

    const searchAndReplaceSourceFiles = [
      `${this.service.context.paths.targetFrontend}/src/**/*/*.{tsx,ts}`,
      `${this.service.context.paths.targetFrontend}/src/*.{tsx,ts}`
    ];

    await this.service.searchReplace({
      files: searchAndReplaceSourceFiles,
      from: /\/css\//g,
      to: "/styles/",
      ignore: [...IGNORE_PATTERNS],
      allowEmptyPaths: true
    });

    await this.service.searchReplace({
      files: [
        ...searchAndReplaceSourceFiles,
        `${this.service.context.paths.targetFrontend}/src/**/*.{css,scss}`,
        `${this.service.context.paths.targetFrontend}/src/*.{css,scss}`
      ],
      from: /\/images\//g,
      to: "/assets/",
      ignore: [...IGNORE_PATTERNS],
      allowEmptyPaths: true
    });

    await this.service.searchReplace({
      files: searchAndReplaceSourceFiles,
      from: /Src\/Root/g,
      to: "Src/App",
      ignore: [...IGNORE_PATTERNS],
      allowEmptyPaths: true
    });
  }
}

export default WorkflowCorrectness;
