import "@testing-library/jest-dom";
import ReactGA from "react-ga";

ReactGA.initialize("foo", { testMode: true });

// Mock react-i18next for all tests
jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  useTranslation: () => ({ t: (key) => key }),
}));
