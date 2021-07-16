// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import ReactGA from "react-ga";

// Initialize ReactGa in test mode to avoid real events during testing
ReactGA.initialize('foo', { testMode: true });