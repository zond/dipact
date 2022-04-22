import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PlayerCount from "../PlayerCount";

interface ArrangeOptions {
  props: Parameters<typeof PlayerCount>[0];
}

describe("PlayerCount", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<PlayerCount {...options.props} />);
  };
  test("Renders without error", () => {
    const props = { numPlayers: 3, maxNumPlayers: 4 };
    arrange({ props });
  });
});
