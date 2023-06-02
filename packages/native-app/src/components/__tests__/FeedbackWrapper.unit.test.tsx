import React from "react";
import FeedbackWrapper from "../FeedbackWrapper";
import { useFeedbackWrapper } from "@diplicity/common";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { act } from "react-test-renderer";

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useFeedbackWrapper: jest.fn(),
}));

const childText = "childText";
const feedbackText = "feedbackText";

interface ArrangeOptions {
  feedback?: any[];
}

const mockHandleClose = jest.fn();

describe("FeedbackWrapper", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
  });
  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  const arrange = (options?: ArrangeOptions) => {
    (useFeedbackWrapper as jest.Mock).mockImplementation(() => ({
      feedback: options?.feedback || [],
      handleClose: mockHandleClose,
    }));
    return render(
      <FeedbackWrapper>
        <Text>{childText}</Text>
      </FeedbackWrapper>
    );
  };
  test("Shows child if no feedback", () => {
    const { getByText } = arrange();
    getByText(childText);
    act(() => {
      jest.runAllTimers();
    });
  });
  test("Shows feedback and child if feedback", () => {
    const { getByText } = arrange({
      feedback: [{ id: 1, severity: "error", message: feedbackText }],
    });
    getByText(childText);
    getByText(feedbackText);
    act(() => {
      jest.runAllTimers();
    });
  });
  test("Calls handleClose when hide", () => {
    arrange({
      feedback: [{ id: 1, severity: "error", message: feedbackText }],
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(mockHandleClose).toBeCalledWith(1);
  });
});
