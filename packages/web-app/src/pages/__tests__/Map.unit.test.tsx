import React from "react";

import Component from "../Map";
import { translateKeys as tk, useMap } from "@diplicity/common";
import CreateOrderMenu from "../../components/CreateOrderMenu";
import { fireEvent, render } from "@testing-library/react";
import { useParams } from "react-router-dom";
import Svg from "react-inlinesvg";
import useSearchParams from "../../hooks/useSearchParams";

type UseMapValues = ReturnType<typeof useMap>;

interface ArrangeOptions {
  useMapValues: UseMapValues;
}

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useMap: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));
jest.mock("react-inlinesvg", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../hooks/useSearchParams");
jest.mock("../../components/CreateOrderMenu");

const mockUseSearchParams = useSearchParams as jest.Mock;
const useMapMock = useMap as jest.Mock;
const mockCreateOrderMenu = CreateOrderMenu as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockSvg = Svg as unknown as jest.Mock;

const mockSetParam = jest.fn();

const gameId = "gameId";

describe("Map", () => {
  let useMapValues: UseMapValues;
  const arrange = (options: ArrangeOptions) => {
    mockUseParams.mockImplementation(() => gameId);
    mockUseSearchParams.mockImplementation(() => ({
        setParam: mockSetParam,
    }));
    mockSvg.mockImplementation(() => <div>SvgElement</div>);
    mockCreateOrderMenu.mockImplementation(
      ({ close }: { close: () => void }) => {
        return <div>CreateOrderMenu</div>;
      }
    );
    useMapMock.mockImplementation(() => options.useMapValues);
    return render(<Component />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
    useMapValues = {
      isError: false,
      isLoading: false,
      data: "<svg></svg>",
    };
  });
  test("CreateOrderMenu not visible by default", () => {
    const screen = arrange({ useMapValues });
    screen.getByText("CreateOrderMenu");
  });
  test("Clicking fab shows CreateOrderMenu", () => {
    const screen = arrange({ useMapValues });
    const fab = screen.getByLabelText("add");
    fireEvent.click(fab);
    expect(mockSetParam).toBeCalledWith("create-order-menu", "1");
  });
  test("Shows loading spinner if loading", () => {
    useMapValues.isLoading = true;
    const screen = arrange({ useMapValues });
    expect(screen.getByTitle(tk.loading.title)).toBeTruthy();
  });
  test("Hides map if not data", () => {
    useMapValues.data = undefined;
    const screen = arrange({ useMapValues });
    expect(screen.queryByText("SvgElement")).toBeFalsy();
  });
  test("Renders map if data", () => {
    const screen = arrange({ useMapValues });
    expect(screen.getByText("SvgElement")).toBeTruthy();
  });

});
