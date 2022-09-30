import reducer, { actions } from "../createOrder";
import { CreateOrder, OrderType } from "../types";

const initialState: CreateOrder = {};

const berlin = "ber";
const move = OrderType.Move;

describe("createOrder actions", () => {
  test("clear", () => {
    const state = { ...initialState, source: berlin };
    const updatedState = reducer(state, actions.clear());
    expect(updatedState).toEqual({});
  });
  test("setSource", () => {
    const state = { ...initialState };
    const updatedState = reducer(state, actions.setSource(berlin));
    expect(updatedState).toEqual({ source: berlin });
  });
  test("setType", () => {
    const state = { ...initialState, source: berlin };
    const updatedState = reducer(state, actions.setType(move));
    expect(updatedState).toEqual({ source: berlin, type: move });
  });
  test("setTarget", () => {
    const state = { ...initialState, source: berlin, type: move };
    const updatedState = reducer(state, actions.setTarget(berlin));
    expect(updatedState).toEqual({
      source: berlin,
      type: move,
      target: berlin,
    });
  });
  test("setAux", () => {
    const state = { ...initialState, source: berlin, type: move };
    const updatedState = reducer(state, actions.setAux(berlin));
    expect(updatedState).toEqual({
      source: berlin,
      type: move,
      aux: berlin,
    });
  });
  test("setAuxTarget", () => {
    const state = { ...initialState, source: berlin, type: move, aux: berlin };
    const updatedState = reducer(state, actions.setTarget(berlin));
    expect(updatedState).toEqual({
      source: berlin,
      type: move,
      aux: berlin,
      target: berlin,
    });
  });
});
