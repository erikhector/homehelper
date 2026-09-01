import Logger from "./core/logger.js";
import Service from "./core/service.js";
import ContextBuilder from "./core/context.js";
import WorkflowDelete from "./workflows/workflow-delete.js";
import WorkflowCopy from "./workflows/workflow-copy.js";
import WorkflowPackageJson from "./workflows/workflow-package-json.js";
import WorkflowCorrectness from "./workflows/workflow-correctness.js";
import WorkflowEnv from "./workflows/workflow-env.js";

const templateProjectPath = "C:\\dev\\jobb\\dekiru\\internal\\dekiru-template-web";

/**
 * Main sync function - orchestrates the sync process for a target project
 * @param {string} targetProjectPath - Path to the project to sync
 */
async function syncFrontend(targetProjectPath) {
  const logger = new Logger();

  try {
    logger.info(`Starting sync for project: ${targetProjectPath} using template: ${templateProjectPath}`);
    const contextBuilder = new ContextBuilder(logger);
    const context = await contextBuilder.build(templateProjectPath, targetProjectPath);

    const service = new Service(context, logger);

    const workflowDelete = new WorkflowDelete(service, logger);
    await workflowDelete.execute();

    const workflowCopy = new WorkflowCopy(service, logger);
    await workflowCopy.execute();

    const workflowPackageJson = new WorkflowPackageJson(service, logger);
    await workflowPackageJson.execute();

    const workflowCorrectness = new WorkflowCorrectness(service, logger);
    await workflowCorrectness.execute();

    const workflowEnv = new WorkflowEnv(service, logger);
    await workflowEnv.execute();

    logger.success(`Sync completed successfully for ${targetProjectPath}`);
  } catch (error) {
    logger.error(`Fatal error during sync: ${error}`);
    throw error;
  }
}

// Main execution
const argTargetProjectPath = [
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_AG_Readonly",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_Anvandareadmin"
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_Anvisningar",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_Deploy_Overview",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_API_Anonymous_Sandbox",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_EXT_Motpart",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_EXT_NYK",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_Filer"
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_Inrapportering",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_INT_Motpart",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_INT_Ny",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_INT_NYK",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_Registervard",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_Urval",
  // "C:\\dev\\sn\\LISA\\Source\\LISA_WEB_AG_Ny"
  // "C:\\dev\\dekiru\\bokinfo\\ebook-web",
  // "C:\\dev\\dekiru\\bokinfo\\stat-web-3"
  // "C:\\dev\\dekiru\\bokinfo\\DMA",
  // "C:\\dev\\si\\mina-sidor"
  // "C:\\dev\\si\\Verksamhetssystemet\\SSI Solution\\SSI.Webbuppgift"
  // "C:\\dev\\dekiru\\kommunal\\Overwatcher",
  // "C:\\dev\\dekiru\\kommunal\\Scheduler",
  // "C:\\dev\\dekiru\\internal\\TBRapp",
  // "C:\\dev\\dekiru\\grappe\\Grappe"
  // "C:\\dev\\dekiru\\deve\\dv"
  "C:\\dev\\jobb\\grappe\\Grappe\\Source\\Grappe.Member"
  // "C:\\dev\\grappe\\Grappe\\Source\\Grappe.Admin"
];

const promises = argTargetProjectPath.map((targetProjectPath) => syncFrontend(targetProjectPath));

await Promise.allSettled(promises);

export default syncFrontend;
