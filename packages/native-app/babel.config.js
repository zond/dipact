module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          react: "./node_modules/react",
          "react-redux": "./node_modules/react-redux",
          "react-ga": "./node_modules/react-ga",
        },
      },
    ],
  ],
};
