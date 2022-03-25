import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AuthWrapper from "../AuthWrapper";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { authActions } from "@diplicity/common";

const childText = "childText";
const token = "token";

const mockReplace = jest.fn();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    replace: mockReplace,
  }),
  useLocation: jest.fn(),
}));
const mockUseDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockUseDispatch,
  useSelector: jest.fn(),
}));

describe("AuthWrapper", () => {
  beforeEach(() => {
    (useLocation as jest.Mock).mockImplementation(() => ({ search: "" }));
  });
  const renderWrapper = () =>
    render(
      <AuthWrapper>
        <div>{childText}</div>
      </AuthWrapper>
    );
  test("Renders without error", () => {
    renderWrapper();
  });
  test("If token in store dispatch is not called", () => {
    (useSelector as jest.Mock).mockImplementation(() => token);
    renderWrapper();
    expect(mockUseDispatch).not.toBeCalled();
  });
  test("If token not in store, qs, or local storage dispatch is not called", () => {
    renderWrapper();
    expect(mockUseDispatch).not.toBeCalled();
  });
  test("If token not in store dispatch is called if token in qsParams", () => {
    (useLocation as jest.Mock).mockImplementation(() => ({
      search: "?token=token",
    }));
    renderWrapper();
    expect(mockUseDispatch).toBeCalledWith(authActions.login(token));
  });
  test("If token not in store dispatch is called if token in localStorage", () => {
    jest.spyOn(window.localStorage.__proto__, "getItem");
    window.localStorage.__proto__.getItem = jest.fn();
    (window.localStorage.__proto__.getItem as jest.Mock).mockImplementation(
      () => token
    );
    renderWrapper();
    expect(mockUseDispatch).toBeCalledWith(authActions.login(token));
  });
});
