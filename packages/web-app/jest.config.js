// example jest config
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "identity-obj-proxy",
  },
  // test match files that end in .functional.test.ts or .unit.test.ts
  testMatch: ["**/*.(functional.test|unit.test).(ts|tsx)"],
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["^.+\\.module\\.(css|sass|scss)$"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./src/setupTests.ts"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
