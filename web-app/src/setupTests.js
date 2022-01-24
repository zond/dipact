import "@testing-library/jest-dom";
import ReactGA from "react-ga";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { setGlobalConfig } from "@storybook/testing-react";
import failOnConsole from "jest-fail-on-console";
import * as globalStorybookConfig from "../.storybook/preview";

setGlobalConfig(globalStorybookConfig);

Enzyme.configure({ adapter: new Adapter() });

// Initialize ReactGa in test mode to avoid real events during testing
ReactGA.initialize("foo", { testMode: true });

require("jest-fetch-mock").enableMocks();

// Mock react-i18next for all tests
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

failOnConsole({
  shouldFailOnWarn: true,
});
