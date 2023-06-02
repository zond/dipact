import React from "react";

import { render } from "@testing-library/react-native";
import AuthWrapper from "../AuthWrapper";
import { useSelector } from "react-redux";
import { Linking } from "react-native";
import { authActions } from "diplicity-common-internal";

const childText = "childText";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

interface ArrangeOptions {
  token?: string;
}

jest.mock("react-native/Libraries/Linking/Linking", () => {
  let listeners: any[] = [];
  return {
    addEventListener: jest.fn((event, handler) => {
      listeners.push({ event, handler });
    }),
    emit: jest.fn((event, props) => {
      listeners
        .filter((l) => l.event === event)
        .forEach((l) => l.handler(props));
    }),
    removeAllListeners: jest.fn(() => (listeners = [])),
  };
});

describe("AuthWrapper", () => {
  beforeEach(() => {});
  const arrange = (options?: ArrangeOptions) => {
    (useSelector as jest.Mock).mockImplementation(() => options?.token);
    return render(
      <AuthWrapper>
        <div>{childText}</div>
      </AuthWrapper>
    );
  };
  test("Renders without error", () => {
    arrange();
  });
  test("If token in store dispatch is not called", () => {
    arrange({ token: "123" });
    Linking.emit("url", { url: "www.site.com/?token=123" });
    expect(mockDispatch).not.toBeCalled();
  });
  test("If token not in store and not in url dispatch is not called", () => {
    arrange();
    Linking.emit("url", { url: "www.site.com/?other=123" });
    expect(mockDispatch).not.toBeCalled();
  });
  test("If token not in store and in url dispatch is called", () => {
    arrange();
    Linking.emit("url", { url: "www.site.com/?token=123" });
    expect(mockDispatch).toBeCalledWith(authActions.login("123"));
  });
});
