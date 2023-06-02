/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require("path");
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

module.exports = {
  projectRoot: workspaceRoot,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      react: path.resolve(workspaceRoot, "node_modules/react"),
      "diplicity-common-internal": path.resolve(workspaceRoot, "packages/"),
    },
    nodeModulesPaths: [
      path.resolve(workspaceRoot, "node_modules"),
      path.resolve(workspaceRoot, "packages"),
      path.resolve(projectRoot, "node_modules"),
    ],
  },
};
