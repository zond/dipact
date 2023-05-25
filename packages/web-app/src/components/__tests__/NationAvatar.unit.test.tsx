import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NationAvatar, { withMuted } from "../NationAvatar.new";

interface ArrangeOptions {
  props: Parameters<typeof NationAvatar>[0];
}

let props: ArrangeOptions["props"];
const color = "#000000";
const link =
  "https://diplicity-engine.appspot.com/Variant/Classical/Flags/England.svg";
const nation = "England";
const nationAbbreviation = "En";

const mockOnClick = jest.fn();

describe("NationAvatar", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<NationAvatar {...options.props} />);
  };
  beforeEach(() => {
    props = {
      color,
      link,
      nation,
      nationAbbreviation,
      onClick: mockOnClick,
    };
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Long abbreviation", () => {
    props.nationAbbreviation = "England";
    arrange({ props });
  });
});

describe("Muted NationAvatar", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(withMuted(<NationAvatar {...options.props} />));
  };
  beforeEach(() => {
    props = {
      color,
      link,
      nation,
      nationAbbreviation,
      onClick: mockOnClick,
    };
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ props });
  });
});
