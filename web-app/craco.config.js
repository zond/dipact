/* craco.config.js */
const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-redux": require.resolve("react-redux"),
    },
  },
};
