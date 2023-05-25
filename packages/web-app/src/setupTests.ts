import "@testing-library/jest-dom";
import { Request, Response, Headers } from "node-fetch";
import ReactGA from "react-ga";

// reassign objects that are otherwise undefined in jest
global.fetch = jest.fn();
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;
global.Headers = Headers as unknown as typeof global.Headers;

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
