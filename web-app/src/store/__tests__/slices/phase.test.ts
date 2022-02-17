import { AnyAction } from "@reduxjs/toolkit";

import reducer, { actions } from "../../phase";

const initialState = null;

describe("phase slice", () => {
  test("should return the initial state", () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  test("Set should set number", () => {
    const expectedState = 1;
    const action: AnyAction = actions.set(1);
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  test("Clear should clear number", () => {
    const state = 1;
    const expectedState = null;
    const action: AnyAction = actions.clear();
    expect(reducer(state, action)).toEqual(expectedState);
  });
});
