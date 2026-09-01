import path from "path";

// Delete files in target project that are no longer used in our template
class WorkflowDelete {
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
    this.logger.setWorkflowName("Delete");
  }

  async execute() {
    this.logger.workflow("Starting deletion workflow");

    // The reason we search using glob is that the files might be located in different places
    const [indexEjs, customDTs, reactRouterDTs] = await Promise.all([
      this.service.findGlob(`**/*/index.ejs`),
      this.service.findGlob(`**/*/custom.d.ts`, { caseSensitiveMatch: false }),
      this.service.findGlob(`**/*/react-router-extended.d.ts`)
    ]);

    if (indexEjs.length > 0) {
      await this.service.deleteFile(indexEjs[0]);
    }
    if (customDTs.length > 0) {
      const promises = customDTs.map(async (filePath) => this.service.deleteFile(filePath));
      await Promise.all(promises);
    }
    if (reactRouterDTs.length > 0) {
      await this.service.deleteFile(reactRouterDTs[0]);
    }

    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "webpack.config.js"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "webpack.utils.js"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "webpack-dev-server.js"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "webpack.config.extendedSettings.js"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "tsconfig.base.json"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "ServiceWorker.ts"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "index.html"));
    // await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, ".env.local"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "knip.json"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, ".stylelintrc.json"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, ".stylelintignore"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "vite.utils.ts"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "interfaces", "TemplateGlobals.d.ts"));

    // CRA specific files
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "react-app-env.d.ts"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "index.tsx"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "setupTests.ts"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "setupProxy.js"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "reportWebVitals.ts"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "src", "logo.svg"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "KomIgang.md"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "konfigs.md"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "README.md"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, ".gitignore"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "public", "logo192.png"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "public", "logo512.png"));
    await this.service.deleteFile(path.join(this.service.context.paths.targetFrontend, "public", "manifest.json"));
  }
}

export default WorkflowDelete;
