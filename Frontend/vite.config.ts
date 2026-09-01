import { defineConfig, mergeConfig } from "vite";
import type { UserConfig } from "vite";

import defineBaseConfig from "./vite.config.base.ts";

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  // Uncomment the lines below if you need to access env variables in this file
  // const { mode } = configEnv;
  // const envConfig = loadEnv(mode, process.cwd(), "CONFIG");
  // const envVite = loadEnv(mode, process.cwd(), "VITE");
  // const env = { ...envConfig, ...envVite };

  const baseConfig = defineBaseConfig(configEnv);

  // Add any project specific configuration here
  const customConfig: UserConfig = {};

  return mergeConfig(baseConfig, customConfig);
});
