// Override babelrc for create react app
// See: https://material-ui.com/guides/minimizing-bundle-size/
const { useBabelRc, override } = require("customize-cra");

module.exports = override(useBabelRc());
