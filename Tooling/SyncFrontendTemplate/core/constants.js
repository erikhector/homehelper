// Packages to remove during migration (Webpack, CRA, and related tooling)
export const packagesToUninstall = [
  "@cerner/duplicate-package-checker-webpack-plugin",
  "@pmmmwh/react-refresh-webpack-plugin",
  "clean-webpack-plugin",
  "copy-webpack-plugin",
  "css-loader",
  "css-minimizer-webpack-plugin",
  "detect-port-alt",
  "dotenv",
  "eslint-webpack-plugin",
  "fork-ts-checker-webpack-plugin",
  "html-webpack-plugin",
  "mini-css-extract-plugin",
  "react-compiler-webpack",
  "react-dev-utils",
  "react-refresh",
  "react-refresh-typescript",
  "sass",
  "sass-loader",
  "speed-measure-webpack-plugin",
  "style-loader",
  "stylelint-config-recommended",
  "terser-webpack-plugin",
  "ts-loader",
  "webpack",
  "webpack-bundle-analyzer",
  "webpack-cli",
  "webpack-dev-server",
  "webpack-merge",
  "workbox-webpack-plugin",
  // CRA specific packages
  "react-scripts",
  "http-proxy-middleware",
  "web-vitals",
  "service-worker-loader",
  "@testing-library/jest-dom",
  "@testing-library/react",
  "@testing-library/user-event",
  "jest",
  "@types/jest",
  // Old vite setup packages
  "vite-tsconfig-paths"
];

// Packages to install for Vite setup
export const packagesToInstall = [
  "@babel/core",
  "@rolldown/plugin-babel",
  "@types/babel__core",
  "@vitejs/plugin-react",
  "babel-plugin-react-compiler",
  "rollup-plugin-visualizer",
  "vite",
  "vite-plugin-checker",
  "vite-plugin-pwa",
  "stylelint-config-standard",
  "react-compiler-runtime" // Remove when frontend template uses React 19 or higher
];

export const IGNORE_PATTERNS = ["**/*/node_modules/**", "node_modules/*", "node_modules/**", "**/*/Backend/**", "**/api/*"];
