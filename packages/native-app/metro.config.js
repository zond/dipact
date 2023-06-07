/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require("path");
const projectRoot = __dirname;
const packagePath = path.resolve(projectRoot, "../common");

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, "node_modules"), packagePath],
  },
  watchFolders: [packagePath],
};
