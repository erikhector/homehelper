import { styleText } from "node:util";

/**
 * Logger with colored output.
 */
class Logger {
  constructor() {
    this.workflowName = "";
  }

  setWorkflowName(name) {
    this.workflowName = name;
  }

  #padPrefix(prefix) {
    return prefix.padEnd(6, " ");
  }

  #formatMessage(message, context = {}) {
    const contextStr = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : "";
    const projectPrefix = this.workflowName ? `[${this.workflowName}] ` : "";
    return `${styleText("magenta", projectPrefix)}${message}${contextStr}`;
  }

  error(message, context = {}) {
    const formatted = this.#formatMessage(message, context);
    console.log(`${styleText("red", this.#padPrefix("[ERR]"))} ${formatted}`);
  }

  warn(message, context = {}) {
    const formatted = this.#formatMessage(message, context);
    console.log(`${styleText("yellow", this.#padPrefix("[WARN]"))} ${formatted}`);
  }

  info(message, context = {}) {
    const formatted = this.#formatMessage(message, context);
    console.log(`${styleText("blue", this.#padPrefix("[INFO]"))} ${formatted}`);
  }

  success(message, context = {}) {
    const formatted = this.#formatMessage(message, context);
    console.log(`${styleText("green", this.#padPrefix("[OK]"))} ${formatted}`);
  }

  workflow(message, context = {}) {
    const formatted = this.#formatMessage(message, context);
    console.log(`\n${styleText("cyan", this.#padPrefix("[FLOW]"))} ${formatted}`);
  }
}

export default Logger;
