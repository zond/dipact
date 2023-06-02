import React from "react";
import { render } from "@testing-library/react-native";

import Sut from "../VariantInfo";

jest.mock("../../../hooks/useParams", () => ({
  useParams: () => ({
    gameId: "gameId",
  }),
}));

const variant = { name: "Classical", nations: [] };

jest.mock("diplicity-common-internal", () => ({
  assertDefined: jest.fn().mockImplementation((arg) => arg),
  findVariantByGame: jest.fn().mockImplementation(() => variant),
  useVariantInfoView: () => ({
    query: {
      data: {
        variants: [variant],
        game: { variant: variant.name },
      },
    },
  }),
}));

describe("VariantInfo", () => {
  const renderSut = () => render(<Sut />);
  test("Renders without error", () => {
    renderSut();
  });
});
