import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FeedbackWrapper from "../FeedbackWrapper";
import { useFeedbackWrapper } from "@diplicity/common";

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useFeedbackWrapper: jest.fn(),
}));

const childText = "childText";
const feedbackText = "feedbackText";

describe("FeedbackWrapper", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  test("Shows child if no feedback", () => {
    (useFeedbackWrapper as jest.Mock).mockImplementation(() => ({
      feedback: [],
      handleClose: () => {},
    }));
    render(
      <FeedbackWrapper>
        <div>{childText}</div>
      </FeedbackWrapper>
    );
    screen.getByText(childText);
  });
  test("Shows feedback and child if feedback", () => {
    (useFeedbackWrapper as jest.Mock).mockImplementation(() => ({
      feedback: [{ id: 1, severity: "error", message: feedbackText }],
      handleClose: () => {},
    }));
    render(
      <FeedbackWrapper>
        <div>{childText}</div>
      </FeedbackWrapper>
    );
    screen.getByText(childText);
    screen.getByText(feedbackText);
  });
  test("Calls handleClose when clickAway", () => {
    const mockHandleClose = jest.fn();
    (useFeedbackWrapper as jest.Mock).mockImplementation(() => ({
      feedback: [{ id: 1, severity: "error", message: feedbackText }],
      handleClose: mockHandleClose,
    }));
    render(
      <>
        <div>outside</div>
        <FeedbackWrapper>
          <div>{childText}</div>
        </FeedbackWrapper>
      </>
    );
    jest.runAllTimers();
    const outsideElement = screen.getByText("outside");
    fireEvent.click(outsideElement);
    jest.runAllTimers();
    expect(mockHandleClose).toBeCalledWith(1);
  });
});
