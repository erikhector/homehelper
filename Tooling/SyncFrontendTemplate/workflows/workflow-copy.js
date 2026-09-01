import path from "path";
import { existsSync } from "fs";
import fs from "fs/promises";

class WorkflowCopy {
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
    this.logger.setWorkflowName("Copy");
  }

  async execute() {
    this.logger.workflow("Starting copy workflow");

    // The reason for skipping copy if files if they exist for some of the files
    // is that they might have been customized in the target project

    await this.service.copySameFile(path.join("Frontend", "vite.config.base.ts"));
    await this.service.copySameFile(path.join("Frontend", "vite.config.ts"), true);
    await this.service.copySameFile(path.join("Frontend", "tsconfig.json"));
    await this.service.copySameFile(path.join("Frontend", "tsconfig.app.base.json"));
    await this.service.copySameFile(path.join("Frontend", "tsconfig.app.json"), true);
    await this.service.copySameFile(path.join("Frontend", "tsconfig.node.json"));
    await this.service.copySameFile(path.join("Frontend", "knip.config.base.js"));
    await this.service.copySameFile(path.join("Frontend", "knip.config.js"), true);
    await this.service.copySameFile(path.join("Frontend", "stylelint.config.base.js"));
    await this.service.copySameFile(path.join("Frontend", "stylelint.config.js"), true);
    await this.service.copySameFile(path.join("Frontend", ".prettierrc"));
    await this.service.copySameFile(path.join("Frontend", ".prettierignore"));
    await this.service.copySameFile(path.join("Frontend", "index.html"), true);
    await this.service.copySameFile(path.join("Frontend", "check-npm.ps1"));
    await this.service.copySameFile(path.join("Frontend", ".vscode", "launch.json"));
    await this.service.copySameFile(path.join("Frontend", ".vscode", "tasks.json"));
    await this.service.copySameFile(path.join("Frontend", ".husky", "pre-commit"), true);
    // await this.service.copySameFile(path.join("Frontend", ".env.development"));
    // await this.service.copySameFile(path.join("Frontend", ".env"));
    // await this.service.copySameFile(path.join("Frontend", ".env.production"));
    await this.service.copySameFile(path.join("Frontend", "manifest.json"), true);

    const reactRouterVersion = await this.service.getDepVersion(this.service.context.paths.targetFrontend, "dependencies", "react-router");
    const reactRouterDomVersion = await this.service.getDepVersion(this.service.context.paths.targetFrontend, "dependencies", "react-router-dom");
    if (reactRouterVersion < 7 || reactRouterDomVersion < 7) {
      this.logger.warn(`Project "react-router" version ${reactRouterVersion} is below 7. Skipping copy of ReactRouterExtended.d.ts.`);
    } else {
      await this.service.copySameFile(path.join("Frontend", "src", "interfaces", "ReactRouterExtended.d.ts"));
    }

    await this.service.copySameFile(path.join("Frontend", "src", "main.tsx"));
    await this.service.copySameFile(path.join("Frontend", "src", "vite-env.d.ts"));
    // await this.service.copySameFile(path.join("Frontend", "public", "favicon.ico"), true);
    // await this.service.copySameFile(path.join("Frontend", "public", "robots.txt"), true);
    await this.service.copySameFile(path.join(".gitignore"));
    await this.service.copySameDir(path.join("Frontend", "public"));

    const vscodeWorkspace = await this.service.findGlob(`*.code-workspace`, { absolute: false });

    await this.service.copyDifferentFile("dekiru-template-web.code-workspace", vscodeWorkspace[0]);
    await this.service.renameDirectory(
      path.join(this.service.context.paths.targetFrontend, "src", "css"),
      path.join(this.service.context.paths.targetFrontend, "src", "styles")
    );

    if (!existsSync(path.join(this.service.context.paths.targetFrontend, "src", "assets"))) {
      await this.service.renameDirectory(
        path.join(this.service.context.paths.targetFrontend, "src", "images"),
        path.join(this.service.context.paths.targetFrontend, "src", "assets")
      );
    } else {
      const files = await fs.readdir(path.join(this.service.context.paths.targetFrontend, "src", "assets"));
      if (files.length > 0 && existsSync(path.join(this.service.context.paths.targetFrontend, "src", "images"))) {
        // Copy contents from styles to assets and then delete styles folder
        const imagesPath = path.join(this.service.context.paths.targetFrontend, "src", "images");
        const assetsPath = path.join(this.service.context.paths.targetFrontend, "src", "assets");
        const cssFiles = await fs.readdir(imagesPath);
        // Copy cssFiles to assetsPath
        for (const file of cssFiles) {
          await fs.copyFile(path.join(imagesPath, file), path.join(assetsPath, file));
        }
        await this.service.deleteDirectory(imagesPath);
      } else if (files.length > 0 && !existsSync(path.join(this.service.context.paths.targetFrontend, "src", "images"))) {
        // Do nothing, assets folder exists and images folder does not exist
      } else {
        await this.service.deleteDirectory(path.join(this.service.context.paths.targetFrontend, "src", "assets"));
        await this.service.renameDirectory(
          path.join(this.service.context.paths.targetFrontend, "src", "images"),
          path.join(this.service.context.paths.targetFrontend, "src", "assets")
        );
      }
    }
  }
}

export default WorkflowCopy;
