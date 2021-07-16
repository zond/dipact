// See: https://github.com/timarney/react-app-rewired
const {
	addBundleVisualizer,
	fixBabelImports,
	override,
} = require("customize-cra");

module.exports = override(
	fixBabelImports("@material-ui/core", {
		libraryName: "@material-ui/core",
		libraryDirectory: "esm",
		camel2DashComponentName: false,
	}),
	fixBabelImports("@material-ui/icons", {
		libraryName: "@material-ui/icons",
		libraryDirectory: "esm",
		camel2DashComponentName: false,
	})
);
