import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FeedbackWrapper from "../FeedbackWrapper";
import useFeedbackWrapper from "../../hooks/useFeedbackWrapper";

jest.mock("../../hooks/useFeedbackWrapper", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const childText = "childText";
const feedbackText = "feedbackText";

describe("FeedbackWrapper", () => {
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
});
