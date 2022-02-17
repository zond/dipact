import { AnyAction } from "@reduxjs/toolkit";

import { Severity } from "../../types";
import reducer, { actions } from "../../feedback";

const message = "Message!";
const initialState = { entities: {}, ids: [] };

describe("feedback slice", () => {
  test("should return the initial state", () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  test("Add feedback should add feedback item", () => {
    const expectedState = {
      entities: { 1: { id: 1, severity: Severity.Success, message } },
      ids: [1],
    };
    const action: AnyAction = actions.add({
      severity: Severity.Success,
      message,
    });
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  test("Add feedback twice should increment id", () => {
    const state = {
      entities: { 1: { id: 1, severity: Severity.Success, message } },
      ids: [1],
    };
    const expectedState = {
      entities: { 1: { id: 1, severity: Severity.Success, message }, 2: { id: 2, severity: Severity.Error, message } },
      ids: [1, 2],
    };
    const action: AnyAction = actions.add({
      severity: Severity.Error,
      message,
    });
    expect(reducer(state, action)).toEqual(expectedState);
  });

  test("Clear feedback clears feedback item", () => {
    const state = {
      entities: { 1: { id: 1, severity: Severity.Success, message } },
      ids: [1],
    };
    const expectedState = {
      entities: {},
      ids: [],
    };
    const action: AnyAction = actions.clear(1);
    expect(reducer(state, action)).toEqual(expectedState);
  });

  test("Clear all feedback clears all feedback items", () => {
    const state = {
      entities: { 1: { id: 1, severity: Severity.Success, message }, 2: { id: 2, severity: Severity.Error, message } },
      ids: [1, 2],
    };
    const expectedState = {
      entities: {},
      ids: [],
    };
    const action: AnyAction = actions.clearAll();
    expect(reducer(state, action)).toEqual(expectedState);
  });
});
