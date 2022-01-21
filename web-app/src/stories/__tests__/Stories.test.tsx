import initStoryshots from "@storybook/addon-storyshots";
import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import React from "react";

import * as chatMessageStories from "../ChatMessage.stories";
import { createSerializer } from "@emotion/jest";
import timezoneMock from "timezone-mock";

timezoneMock.register("US/Pacific");
jest.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue("");
jest.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("");

expect.addSnapshotSerializer(createSerializer());

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  TextField: () => <div></div>,
  Dialog: () => <div></div>,
}));

initStoryshots();

describe("Stories", () => {
  it("should render all storybook stories without error", () => {
    const allStories = Object.values(composeStories(chatMessageStories));
    allStories.forEach((Story) => render(<Story />));
  });
});
