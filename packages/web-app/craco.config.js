/* craco.config.js */
const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        aliases: {
          "react": "./node_modules/react",
          "react-redux": "./node_modules/react-redux",
          "react-ga": "./node_modules/react-ga",
        }
      }
    }
  ]
};