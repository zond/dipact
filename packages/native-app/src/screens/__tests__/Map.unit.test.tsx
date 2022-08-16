import "react-native";
import { Text, TouchableHighlight, View } from "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import Component from "../Map";
import { translateKeys as tk, useMap } from "@diplicity/common";
import CreateOrderMenu from "../../components/CreateOrderMenu";
import PhaseSelector from "../../components/PhaseSelector";
import ImageZoom from "react-native-image-pan-zoom";
import { SvgFromXml } from "react-native-svg";

type UseMapValues = ReturnType<typeof useMap>;
type ComponentProps = Parameters<typeof Component>[0];

interface ArrangeOptions {
  props: ComponentProps;
  useMapValues: UseMapValues;
}

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useMap: jest.fn(),
}));
jest.mock("../../components/PhaseSelector");
jest.mock("../../components/CreateOrderMenu");
jest.mock("react-native-svg", () => ({
  SvgFromXml: jest.fn(),
}));
jest.mock("react-native-image-pan-zoom", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useMapMock = useMap as jest.Mock;
const mockPhaseSelector = PhaseSelector as jest.Mock;
const mockCreateOrderMenu = CreateOrderMenu as jest.Mock;
const mockSvgFromXml = SvgFromXml as jest.Mock;
const mockImageZoom = ImageZoom as unknown as jest.Mock;

const gameId = "gameId";

const phaseSelectorRootStyles = {
  position: "absolute",
  width: "100%",
  zIndex: 1,
};

describe("Map", () => {
  let props: ComponentProps;
  let closeOuter: () => void;
  let useMapValues: UseMapValues;
  const arrange = (options: ArrangeOptions) => {
    mockPhaseSelector.mockImplementation(() => <Text>PhaseSelector</Text>);
    mockCreateOrderMenu.mockImplementation(
      ({ close }: { close: () => void }) => {
        closeOuter = close;
        return <Text>CreateOrderMenu</Text>;
      }
    );
    mockSvgFromXml.mockImplementation(() => <Text>SvgFromXml</Text>);
    mockImageZoom.mockImplementation(({ children }) => <View>{children}</View>);
    useMapMock.mockImplementation(() => options.useMapValues);
    return render(<Component gameId={gameId} />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
    props = { gameId };
    useMapValues = {
      isError: false,
      isLoading: false,
      data: "<svg></svg>",
    };
  });
  test("Phase selector renders", () => {
    arrange({ props, useMapValues });
    expect(mockPhaseSelector).toBeCalledWith(
      { gameId, rootStyles: phaseSelectorRootStyles },
      {}
    );
  });
  test("CreateOrderMenu not visible by default", () => {
    const screen = arrange({ props, useMapValues });
    screen.getByText("CreateOrderMenu");
  });
  test("Clicking fab shows CreateOrderMenu", () => {
    const screen = arrange({ props, useMapValues });
    const fab = screen.getByTestId("RNE__ICON__CONTAINER_ACTION");
    fireEvent.press(fab);
    expect(screen.getByText("CreateOrderMenu")).toBeTruthy();
  });
  test("Press ", () => {
    arrange({ props, useMapValues });
    closeOuter();
  });
  test("Shows loading spinner if loading", () => {
    useMapValues.isLoading = true;
    const screen = arrange({ props, useMapValues });
    expect(screen.getByLabelText(tk.loading.title)).toBeTruthy();
  });
  test("Hides map if not data", () => {
    useMapValues.data = undefined;
    const screen = arrange({ props, useMapValues });
    expect(screen.queryByText("SvgFromXml")).toBeFalsy();
  });
  test("Renders map if data", () => {
    const screen = arrange({ props, useMapValues });
    expect(screen.getByText("SvgFromXml")).toBeTruthy();
  });
  test("Layout event sets width and height", () => {
    const screen = arrange({ props, useMapValues });
    fireEvent(screen.getByTestId("MAP_CONTAINER"), "layout", {
      nativeEvent: { layout: { height: 100, width: 100 } },
    });
    screen.debug();
    expect(mockImageZoom).toBeCalledWith(
      expect.objectContaining({ cropHeight: 100, cropWidth: 100 }),
      {}
    );
  });
});
