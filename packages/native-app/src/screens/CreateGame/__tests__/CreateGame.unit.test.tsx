import React from "react";
import {
  act,
  fireEvent,
  render,
  RenderAPI,
} from "@testing-library/react-native";

import Sut from "../CreateGame";
import { translateKeys as tk, useCreateGameForm } from "@diplicity/common";
import { ReactTestInstance } from "react-test-renderer";
import { Accessor, TargetFactory, TestDriver, Wrapper } from "../../../test";

interface UseCreateGameMockOptions {
  error?: any;
  isError?: boolean;
  isLoading?: boolean;
  selectedVariant?: any | null;
  values?: any;
}

abstract class TestComponent {
  constructor(protected readonly screen: RenderAPI) {}
}

class TextField {
  constructor(private readonly instance: ReactTestInstance) {}
  public type(text: string) {
    fireEvent.changeText(this.instance, text);
  }
}

class Checkbox {
  constructor(private readonly instance: ReactTestInstance) {}
  public check() {
    fireEvent.press(this.instance);
  }
}

const textFieldFactory = (instance: ReactTestInstance) =>
  new TextField(instance);

const checkboxFactory = (instance: ReactTestInstance) => new Checkbox(instance);

class CreateGameTestComponent extends TestComponent {
  // get gameMasterHelpText
  get nameInput() {
    return textFieldFactory(
      this.screen.getByA11yLabel(tk.createGame.nameInput.label)
    );
  }
  get privateCheckbox() {
    return checkboxFactory(
      this.screen.getByA11yLabel(tk.createGame.privateCheckbox.label)
    );
  }
}

class CreateGameTestDriver extends TestDriver {
  public gameMasterCheckboxDisabledHelpText = TargetFactory.create(
    Accessor.ByText,
    tk.createGame.gameMasterCheckbox.helpText.disabled
  );
  public nameInput = TargetFactory.create(
    Accessor.ByAccessibilityLabel,
    tk.createGame.nameInput.label
  );
  public privateCheckbox = TargetFactory.create(
    Accessor.ByAccessibilityLabel,
    tk.createGame.privateCheckbox.label
  );
}

const mockHandleChange = jest.fn();
const mockSetFieldValue = jest.fn();

const createUseCreateGameMock = (options?: UseCreateGameMockOptions) => ({
  handleChange: jest.fn(() => mockHandleChange),
  setFieldValue: mockSetFieldValue,
  query: {
    data: {
      variants: [
        {
          name: "variant",
          description: "description",
          startYear: 1901,
          rules: "",
        },
      ],
    },
  },
  values: {
    name: "name",
    variant: "variant",
    ...options?.values,
  },
});

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useCreateGameForm: jest.fn(),
}));

describe("CreateGame", () => {
  let screen: RenderAPI;
  const renderSut = (options?: UseCreateGameMockOptions) => {
    (useCreateGameForm as jest.Mock).mockImplementation(() =>
      createUseCreateGameMock(options)
    );
    return render(<Sut />);
  };
  const createDriver = () => new CreateGameTestDriver(screen);
  beforeEach(() => {
    screen = renderSut();
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    renderSut();
  });
  test("Name field calls handleChange", () => {
    const driver = createDriver();
    driver.get(driver.nameInput).type("new name");
    expect(mockHandleChange).toBeCalledWith("new name");
  });
  test("Pressing the private checkbox calls setFieldValue", () => {
    const driver = createDriver();
    driver.get(driver.privateCheckbox).toggle();
    expect(mockSetFieldValue).toBeCalledWith("privateGame", true);
  });
  test("When private checkbox is not checked, disabled game master help text is shown", () => {
    screen = renderSut({ values: { privateGame: false } });
    const driver = createDriver();
    expect(
      driver.query(driver.gameMasterCheckboxDisabledHelpText)
    ).toBeTruthy();
  });
  test("When private checkbox is checked, default game master help text is shown", () => {
    screen = renderSut({ values: { privateGame: true } });
    expect(
      screen.getByText(tk.createGame.gameMasterCheckbox.helpText.default)
    ).toBeTruthy();
  });
  test("Pressing gameMaster checkbox calls setFieldValue", () => {
    screen = renderSut({ values: { privateGame: true } });
    const checkbox = screen.getByA11yLabel(
      tk.createGame.gameMasterCheckbox.label
    );
    act(() => {
      fireEvent.press(checkbox);
    });
    expect(mockSetFieldValue).toBeCalledWith("gameMaster", true);
  });
  test("When private game and gameMaster, requireGameMasterInvitation is shown", () => {
    screen = renderSut({ values: { privateGame: true, gameMaster: true } });
    expect(
      screen.getByA11yLabel(tk.createGame.requireGameMasterInvitation.label)
    ).toBeTruthy();
  });
  test("Pressing requireGameMasterInvitation checkbox calls setFieldValue", () => {
    screen = renderSut({ values: { privateGame: true, gameMaster: true } });
    const checkbox = screen.getByA11yLabel(
      tk.createGame.requireGameMasterInvitation.label
    );
    act(() => {
      fireEvent.press(checkbox);
    });
    expect(mockSetFieldValue).toBeCalledWith(
      "requireGameMasterInvitation",
      true
    );
  });
  test("Pressing variant select value calls setFieldValue", () => {
    const variantSelect = screen.getByA11yLabel(
      tk.createGame.variantSelect.label
    );
    act(() => {
      fireEvent.press(variantSelect);
    });
    const menuItem = screen.getByA11yLabel("variant");
    act(() => {
      fireEvent.press(menuItem);
    });
    expect(mockSetFieldValue).toBeCalledWith("variant", "variant");
  });
});
