import { run as jscodeshift } from "jscodeshift/src/Runner.js";
import path from "path";
import fastGlob from "fast-glob";
import { existsSync } from "fs";
import fs from "fs/promises";
import replace from "replace-in-file";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

class Service {
  constructor(context, logger) {
    this.context = context;
    this.logger = logger;
  }

  /**
   * Copy a file from local template to target project (same relative path)
   * @param {string} relPath - Relative path from project root
   * @param {boolean} skipIfExists - Skip if target file already exists
   */
  async copySameFile(relPath, skipIfExists = false) {
    const source = path.join(this.context.paths.templateProjectPath, relPath);
    const target = path.join(this.context.paths.targetProject, relPath);

    if (skipIfExists && existsSync(target)) {
      this.logger.info(`Skipping copy. File already exists: ${target}`);
      return;
    }

    try {
      await fs.copyFile(source, target);
      this.logger.success(`Copied file: ${target}`);
    } catch (error) {
      this.logger.error("Copy file failed", { source, target, error: error.message });
      throw error;
    }
  }

  /**
   * Copy a directory recursively from local template to target project
   * @param {string} relPath - Relative directory path
   */
  async copySameDir(relPath) {
    const source = path.join(this.context.paths.templateProjectPath, relPath);
    const target = path.join(this.context.paths.targetProject, relPath);

    try {
      await fs.cp(source, target, { recursive: true });
      this.logger.success(`Copied dir: ${target}`);
    } catch (error) {
      this.logger.error("Copy dir failed", { source, target, error: error.message });
      throw error;
    }
  }

  /**
   * Copy a file with different source and target paths
   * @param {string} sourceRelPath - Source relative path
   * @param {string} targetRelPath - Target relative path
   */
  async copyDifferentFile(sourceRelPath, targetRelPath) {
    const source = path.join(this.context.paths.templateProjectPath, sourceRelPath);
    const target = path.join(this.context.paths.targetProject, targetRelPath);

    try {
      await fs.copyFile(source, target);
      this.logger.success(`Copied file: ${source} to ${target}`);
    } catch (error) {
      this.logger.error("Copy file failed", { source, target, error: error.message });
      throw error;
    }
  }

  /**
   * Delete a file (if it exists)
   * @param {string} filePath - Absolute path to file
   */
  async deleteFile(filePath) {
    if (!existsSync(filePath)) {
      this.logger.info(`Skipping delete. File does not exist: ${filePath}`);
      return;
    }

    try {
      await fs.unlink(filePath);
      this.logger.success(`Deleted file: ${filePath}`);
    } catch (error) {
      this.logger.error("Delete file failed", { filePath, error: error.message });
      throw error;
    }
  }

  /**
   * Delete a directory recursively (if it exists)
   * @param {string} dirPath - Absolute path to directory
   */
  async deleteDirectory(dirPath) {
    if (!existsSync(dirPath)) {
      this.logger.info(`Skipping delete. Dir does not exist: ${dirPath}`);
      return;
    }

    try {
      await fs.rm(dirPath, { recursive: true });
      this.logger.success(`Deleted dir: ${dirPath}`);
    } catch (error) {
      this.logger.error("Delete directory failed", { dirPath, error: error.message });
      throw error;
    }
  }

  /**
   * Rename a directory
   * @param {string} oldPath - Current path
   * @param {string} newPath - New path
   */
  async renameDirectory(oldPath, newPath) {
    if (!existsSync(oldPath)) {
      this.logger.info(`Skipping rename. Source directory does not exist: ${oldPath}`);
      return;
    }

    // Windows returns EPERM during rename if target dir exists
    // so we need to check and remove it first if it's empty
    if (existsSync(newPath)) {
      const files = await fs.readdir(newPath);
      if (files.length > 0) {
        this.logger.info(`Skipping rename. Target directory already exists and is not empty: ${newPath}`);
        return;
      } else {
        await fs.rmdir(newPath);
        this.logger.info(`Removed empty target directory before rename: ${newPath}`);
      }
    }

    try {
      await fs.rename(oldPath, newPath);
      this.logger.success(`Renamed directory from ${oldPath} to ${newPath}`);
    } catch (error) {
      this.logger.error("Rename directory failed", { oldPath, newPath, error: error.message });
      throw error;
    }
  }

  async codemod(transformPath, paths, options = {}) {
    const defaultOptions = {
      failOnError: true,
      ...options
    };

    try {
      this.logger.info(`Running codemod: ${path.basename(transformPath)} on ${paths.length} file(s)`);
      const result = await jscodeshift(path.resolve(transformPath), paths, defaultOptions);
      this.logger.success(`Codemod completed: ${path.basename(transformPath)}`);
      return result;
    } catch (error) {
      this.logger.error(`Codemod failed: ${path.basename(transformPath)}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Find files matching a glob pattern
   * @param {string} pattern - Glob pattern to match
   * @param {Object} options - Additional glob options
   * @returns {Promise<string[]>} Array of matching file paths
   */
  async findGlob(pattern, options = {}) {
    const IGNORE_PATTERNS = ["**/*/node_modules/**", "node_modules/*", "node_modules/**", "**/*/Backend/**", "**/api/*"];

    const defaultOptions = {
      cwd: this.context.paths.targetProject,
      absolute: true,
      ignore: [...IGNORE_PATTERNS]
    };

    const globOptions = { ...defaultOptions, ...options };

    try {
      const results = await fastGlob(pattern, globOptions);
      this.logger.info(`Found ${results.length} files matching "${pattern}"`);
      return results;
    } catch (error) {
      this.logger.error("Discovery failed", { pattern, error: error.message });
      throw error;
    }
  }

  async getDepVersion(packageJsonPath, dependencyType, dep) {
    const packageJsonContents = require(path.join(packageJsonPath, "package.json"));

    const depVersion = packageJsonContents?.[dependencyType]?.[dep];
    if (!depVersion) {
      return;
    }

    // Remove leading ^, ~, >=, <=, etc.
    const cleanedVersion = depVersion.replace(/^[^\d]*/, "");
    const majorVersion = parseInt(cleanedVersion.split(".")[0], 10);
    return majorVersion;
  }

  async searchReplace(options) {
    try {
      const results = await replace(options);
      if (results.some((result) => result.hasChanged)) {
        this.logger.success(
          `Modified the following files during search and replace '${options.from}' => '${options.to}':\n` +
            results
              .filter((result) => result.hasChanged)
              .map((result) => `  - ${result.file}`)
              .join("\n")
        );
      } else {
        this.logger.info(`No files were modified during search and replace '${options.from}' => '${options.to}'`);
      }
    } catch (error) {
      this.logger.error("Search and replace", error);
    }
  }
}

export default Service;
