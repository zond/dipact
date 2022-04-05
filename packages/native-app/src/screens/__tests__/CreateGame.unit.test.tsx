import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { translateKeys as tk, useCreateGame } from "@diplicity/common";

import CreateGame from "../CreateGame";
import { act } from "react-test-renderer";

// TODO move to setup
jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  useTranslation: () => ({ t: (key: string) => key }),
}));

// TODO move to setup
jest.mock("../../hooks/useTheme", () => ({
  useTheme: jest.fn(() => ({
    spacing: () => 1,
    palette: {
      border: {},
    },
  })),
}));

const mockHandleChange = jest.fn(() => jest.fn());
const mockSetFieldValue = jest.fn(() => jest.fn());
jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useCreateGame: jest.fn(),
}));

const createUseCreateGameMock = (valueOverrides: any = {}) => ({
  handleChange: mockHandleChange,
  setFieldValue: mockSetFieldValue,
  values: {
    privateGame: false,
    gameMaster: false,
    name: "Name",
    ...valueOverrides,
  },
});

describe("CreateGame", () => {
  beforeEach(() => {
    (useCreateGame as jest.Mock).mockImplementation(() =>
      createUseCreateGameMock()
    );
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    const { getByText } = render(<CreateGame />);
    getByText(tk.createGame.nameInput.label);
  });
  test("Press private checkbox calls setFieldValue", () => {
    const { getByLabelText } = render(<CreateGame />);
    const checkbox = getByLabelText(tk.createGame.privateCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("privateGame", true);
  });
  test("Press gameMaster checkbox calls setFieldValue", () => {
    (useCreateGame as jest.Mock).mockImplementation(() =>
      createUseCreateGameMock({ privateGame: true })
    );
    const { getByLabelText } = render(<CreateGame />);
    const checkbox = getByLabelText(tk.createGame.gameMasterCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("gameMaster", true);
  });
  test("Shows default gameMasterCheckbox help text when private is true", () => {
    (useCreateGame as jest.Mock).mockImplementation(() =>
      createUseCreateGameMock({ privateGame: true })
    );
    const { getByText } = render(<CreateGame />);
    getByText(tk.createGame.gameMasterCheckbox.helpText.default);
  });
  test("Shows disabled gameMasterCheckbox help text when private is false", () => {
    const { getByText } = render(<CreateGame />);
    getByText(tk.createGame.gameMasterCheckbox.helpText.disabled);
  });
  test("Require game master invitation does not appear when not gameMaster", () => {
    const { queryByText } = render(<CreateGame />);
    const checkbox = queryByText(
      tk.createGame.requireGameMasterInvitation.label
    );
    expect(checkbox).toBe(null);
  });
  test("Require game master invitation does not appear when not gameMaster", () => {
    (useCreateGame as jest.Mock).mockImplementation(() =>
      createUseCreateGameMock({ privateGame: true, gameMaster: true })
    );
    const { getByLabelText } = render(<CreateGame />);
    getByLabelText(tk.createGame.requireGameMasterInvitation.label);
  });
  test("Press requireGameMasterInvitation calls setFieldValue", () => {
    (useCreateGame as jest.Mock).mockImplementation(() =>
      createUseCreateGameMock({ privateGame: true, gameMaster: true })
    );
    const { getByLabelText } = render(<CreateGame />);
    const checkbox = getByLabelText(tk.createGame.requireGameMasterInvitation.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("requireGameMasterInvitation", true);
  });
});
