import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NavItem from "../NavItem";
import { useHistory } from "react-router-dom";

interface ArrangeOptions {
  props: Omit<Parameters<typeof NavItem>[0], "children">;
}

const childText = "ChildText";
let props: ArrangeOptions["props"];
const href = "https://www.fake.com";
const label = "Click md";

jest.mock("react-router-dom", () => ({
  useHistory: jest.fn(),
}));
const mockPush = jest.fn();

describe("NavItem", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(
      <NavItem {...options.props}>
        <div>{childText}</div>
      </NavItem>
    );
  };
  beforeEach(() => {
    props = {
      href,
      label,
      active: true,
    };
    jest.clearAllMocks();
    (useHistory as jest.Mock).mockImplementation(() => ({ push: mockPush }));
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Inactive", () => {
    props.active = false;
    arrange({ props });
  });
  test("Click button when not external", () => {
    arrange({ props });
    const link = screen.getByTitle(label);
    const button = link.childNodes[0];
    fireEvent.click(button);
    expect(mockPush).toBeCalledWith(href);
  });
  test("Click button when external", () => {
    props.external = true;
    arrange({ props });
    const link = screen.getByTitle(label);
    const button = link.childNodes[0];
    fireEvent.click(button);
    expect(mockPush).not.toBeCalled();
  });
});
