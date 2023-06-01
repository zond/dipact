const config = {
  testDir: "./src/__tests__/",
  testMatch: "**/*.browser.test.ts",
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: [["line"]],
  use: {
    actionTimeout: 0,
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
    screenshot: "off",
  },

  env: process.env.CI ? "prod" : "dev",

  projects: [
    {
      name: "Microsoft Edge",
      use: {
        channel: "msedge",
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "src/__tests__/screenshots/",

  webServer: {
    command: "yarn start-browser-test-server --port 3002",
    timeout: 120 * 1000,
    port: 3002,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
