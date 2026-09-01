import path from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

class ContextBuilder {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Build complete context from target project path
   * @param {string} targetProjectPath - Path to the project to sync
   * @returns {Object} Immutable context object
   */
  async build(templateProjectPath, targetProjectPath) {
    if (!existsSync(templateProjectPath)) {
      throw `Template project path does not exist: ${templateProjectPath}`;
    }

    if (!existsSync(targetProjectPath)) {
      throw `Target project path does not exist: ${targetProjectPath}`;
    }

    const templateFrontendpath = path.join(templateProjectPath, "Frontend");
    const targetFrontendPath = path.join(targetProjectPath, "Frontend");

    if (!existsSync(templateFrontendpath)) {
      throw `Template frontend path does not exist: ${templateFrontendpath}`;
    }

    if (!existsSync(targetFrontendPath)) {
      throw `Target frontend path does not exist: ${targetFrontendPath}`;
    }

    this.checkGitRepo(templateProjectPath);

    const paths = {
      templateProjectPath: templateProjectPath,
      templateFrontendpath: templateFrontendpath,
      targetProject: targetProjectPath,
      targetFrontend: targetFrontendPath
    };

    return Object.freeze({
      paths
    });
  }

  checkGitRepo(templateProjectPath) {
    try {
      try {
        execSync(`git -C ${templateProjectPath} rev-parse --is-inside-work-tree`);
      } catch (error) {
        throw `Not a git repository: ${templateProjectPath}`;
      }

      const branch = execSync(`git -C ${templateProjectPath} rev-parse --abbrev-ref HEAD`).toString().trim();
      if (branch !== "master") {
        throw `Template project is not on master branch: ${branch}`;
      }

      const status = execSync(`git -C ${templateProjectPath} fetch origin && git -C ${templateProjectPath} status`);
      const statusOutput = status.toString();
      if (statusOutput.includes("Your branch is behind")) {
        throw `Template project has commits to pull: ${templateProjectPath}`;
      }
    } catch (error) {
      throw `Error checking git repository: ${typeof error == "string" ? error : error.message}`;
    }
  }
}

export default ContextBuilder;
