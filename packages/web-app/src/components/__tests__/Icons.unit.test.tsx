import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ChatDisabledIcon, NoOrdersGivenIcon, OrdersConfirmedIcon, OrdersOpenIcon, WantsDrawIcon } from "../../icons";

describe("Icons", () => {
  test("OrdersOpenIcon", () => {
    render(<OrdersOpenIcon />);
  });
  test("OrdersConfirmedIcon", () => {
    render(<OrdersConfirmedIcon />);
  });
  test("WantsDrawIcon", () => {
    render(<WantsDrawIcon />);
  });
  test("NoOrdersGivenIcon", () => {
    render(<NoOrdersGivenIcon />);
  });
  test("ChatDisabledIcon", () => {
    render(<ChatDisabledIcon />);
  });
});

