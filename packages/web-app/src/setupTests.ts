import "@testing-library/jest-dom";
import ReactGA from "react-ga";

ReactGA.initialize("foo", { testMode: true });

// Mock react-i18next for all tests
jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  useTranslation: () => ({ t: (key: string) => key }),
}));

// TODO remove when chart.js is gone
jest.mock("chart.js", () => ({
  Chart: {
    register: jest.fn(),
  },
  registerables: [],
}));

// TODO remove when ga-gtag is gone
jest.mock("ga-gtag", () => ({
  __esModule: true,
  default: jest.fn(),
}));
