import { renderHook } from "@testing-library/react-hooks";
import useFeedbackWrapper from "../useFeedbackWrapper";
import { useSelector } from "react-redux";
import { feedbackActions } from "../../store";

const mockUseDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockUseDispatch,
  useSelector: jest.fn(),
}));
const feedback = "feedback";

describe("useFeedbackWrapper", () => {
  beforeEach(() => {
    mockUseDispatch.mockClear();
  });
  test("Returns feedback from store", () => {
    (useSelector as jest.Mock).mockImplementation(() => feedback);
    const { result } = renderHook(() => useFeedbackWrapper());
    expect(result.current.feedback).toBe(feedback);
  });
  test("Calling handleClose dispatches clear feedback action", () => {
    const { result } = renderHook(() => useFeedbackWrapper());
    result.current.handleClose(1)
    expect(mockUseDispatch).toBeCalledWith(feedbackActions.clear(1));
  });
});
