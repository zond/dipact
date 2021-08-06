import "@testing-library/jest-dom";
import ReactGA from "react-ga";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({ adapter: new Adapter() });

// Initialize ReactGa in test mode to avoid real events during testing
ReactGA.initialize("foo", { testMode: true });

require("jest-fetch-mock").enableMocks();
