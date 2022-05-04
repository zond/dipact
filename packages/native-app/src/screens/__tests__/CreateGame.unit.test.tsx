import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import {
  NationAllocation,
  translateKeys as tk,
  useCreateGame,
} from "@diplicity/common";

import CreateGame from "../CreateGame";

interface CreateUseGameMockOptions {
  error?: any;
  isError?: boolean;
  isLoading?: boolean;
  isFetchingVariantSVG?: boolean;
  selectedVariant?: any | null;
  values?: any;
  validationErrors?: any;
  submitDisabled?: boolean;
}

const mockHandleChange = jest.fn(() => jest.fn());
const mockSetFieldValue = jest.fn(() => jest.fn());
const mockSubmitForm = jest.fn(() => jest.fn());
jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  isoCodes: [{ name: "English", code: "en" }],
  useCreateGame: jest.fn(),
}));

const createUseCreateGameMock = (options?: CreateUseGameMockOptions) => ({
  error: options?.error,
  handleChange: jest.fn(() => mockHandleChange),
  isLoading: options?.isLoading || false,
  isFetchingVariantSVG: options?.isFetchingVariantSVG || false,
  isError: options?.isError || false,
  percentages: { minPercentage: 0, maxPercentage: 20 },
  setFieldValue: mockSetFieldValue,
  submitForm: mockSubmitForm,
  validationErrors: {
    ...options?.validationErrors,
  },
  selectedVariant:
    typeof options?.selectedVariant === "undefined"
      ? {
          Name: "Classical",
          Start: { Year: 1901 },
          CreatedBy: "John McD",
          Rules: "Game rules",
        }
      : options.selectedVariant,
  submitDisabled: options?.submitDisabled || false,
  values: {
    adjustmentPhaseLengthMultiplier: 1,
    adjustmentPhaseLengthUnit: 60 * 24,
    anonymousEnabled: false,
    chatLanguage: "players_choice",
    conferenceChatEnabled: true,
    customAdjustmentPhaseLength: false,
    endAfterYears: false,
    endAfterYearsValue: 1,
    gameMaster: false,
    groupChatEnabled: true,
    individualChatEnabled: true,
    maxRating: 0,
    maxRatingEnabled: false,
    minQuickness: 0,
    minRating: 0,
    minRatingEnabled: false,
    minReliability: 0,
    name: "Name",
    nationAllocation: NationAllocation.Random,
    phaseLengthMultiplier: 1,
    phaseLengthUnit: 60 * 24,
    privateGame: false,
    quicknessEnabled: true,
    reliabilityEnabled: true,
    requireGameMasterInvitation: false,
    skipGetReadyPhase: true,
    variant: "Classical",
    ...options?.values,
  },
  variants: [{ Name: "Twenty Twenty", Nations: ["England"] }],
});

describe("CreateGame", () => {
  const arrange = (options?: CreateUseGameMockOptions) => {
    (useCreateGame as jest.Mock).mockImplementation(() =>
      createUseCreateGameMock(options)
    );
    return render(<CreateGame />);
  };
  beforeEach(() => {
    (useCreateGame as jest.Mock).mockImplementation(() =>
      createUseCreateGameMock()
    );
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    const { getByText } = arrange();
    getByText(tk.createGame.nameInput.label);
  });
  test("Shows loading if loading", () => {
    const { getByLabelText } = arrange({ isLoading: true });
    getByLabelText(tk.loading.title);
  });
  test("Shows Error if isError and error", () => {
    const { getByText } = arrange({ isError: true, error: {} });
    getByText("Error!");
  });
  test("Change name input calls handleChange", () => {
    const { getByLabelText } = arrange();
    const input = getByLabelText(tk.createGame.nameInput.label);
    fireEvent.changeText(input, "Hello");
    expect(mockHandleChange).toBeCalledWith("Hello");
  });
  test("Name shake does nothing", () => {
    const { getByLabelText } = arrange();
    const input = getByLabelText(tk.createGame.nameInput.label);
    fireEvent(input, "shake");
  });
  test("Press private checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(tk.createGame.privateCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("privateGame", true);
  });
  test("Press gameMaster checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange({
      values: { privateGame: true },
    });
    const checkbox = getByLabelText(tk.createGame.gameMasterCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("gameMaster", true);
  });
  test("Shows default gameMasterCheckbox help text when private is true", () => {
    const { getByText } = arrange({ values: { privateGame: true } });
    getByText(tk.createGame.gameMasterCheckbox.helpText.default);
  });
  test("Shows disabled gameMasterCheckbox help text when private is false", () => {
    const { getByText } = arrange();
    getByText(tk.createGame.gameMasterCheckbox.helpText.disabled);
  });
  test("Require game master invitation does not appear when not gameMaster", () => {
    const { queryByText } = arrange();
    const checkbox = queryByText(
      tk.createGame.requireGameMasterInvitation.label
    );
    expect(checkbox).toBe(null);
  });
  test("Require game master invitation does appears when gameMaster", () => {
    const { getByLabelText } = arrange({
      values: { privateGame: true, gameMaster: true },
    });
    getByLabelText(tk.createGame.requireGameMasterInvitation.label);
  });
  test("Press requireGameMasterInvitation calls setFieldValue", () => {
    const { getByLabelText } = arrange({
      values: { privateGame: true, gameMaster: true },
    });
    const checkbox = getByLabelText(
      tk.createGame.requireGameMasterInvitation.label
    );
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith(
      "requireGameMasterInvitation",
      true
    );
  });
  test("Shows loading if selectedVariant is null", () => {
    const { getByLabelText } = arrange({ selectedVariant: null });
    getByLabelText(tk.loading.title);
  });
  test("Shows loading if isFetchingVariantSVG", () => {
    const { getByLabelText } = arrange({ isFetchingVariantSVG: true });
    getByLabelText(tk.loading.title);
  });
  test("Change variantSelect calls setFieldValue", () => {
    const { getByTestId } = arrange();
    const picker = getByTestId(tk.createGame.variantSelect.label);
    fireEvent(picker, "onValueChange", "Twenty Twenty");
    expect(mockSetFieldValue).lastCalledWith("variant", "Twenty Twenty");
  });
  test("Variant start year appears", () => {
    const { getByText } = arrange();
    getByText("1901");
  });
  test("Variant author appears", () => {
    const { getByText } = arrange();
    getByText("John McD");
  });
  test("Variant rules appear", () => {
    const { getByText } = arrange();
    getByText("Game rules");
  });
  test("Change nationAllocation calls setFieldValue", () => {
    const { getByTestId } = arrange();
    const picker = getByTestId(tk.createGame.nationAllocationSection.label);
    fireEvent(picker, "onValueChange", NationAllocation.Preference);
    expect(mockSetFieldValue).lastCalledWith(
      "nationAllocation",
      NationAllocation.Preference
    );
  });
  test("Change phaseLengthMultiplierInput calls handleChange", () => {
    const { getByLabelText } = arrange();
    const input = getByLabelText(
      tk.createGame.phaseLengthMultiplierInput.label
    );
    fireEvent.changeText(input, "3");
    expect(mockHandleChange).toBeCalledWith("3");
  });
  test("Change phaseLengthUnitSelect calls setFieldValue", () => {
    const { getByTestId } = arrange();
    const picker = getByTestId(tk.createGame.phaseLengthUnitSelect.label);
    fireEvent(picker, "onValueChange", 1);
    expect(mockSetFieldValue).lastCalledWith("phaseLengthUnit", 1);
  });
  test("phaseLengthUnit labels are singular if phaseLengthMultiplier is singular", () => {
    const { getByTestId } = arrange();
    const picker = getByTestId(tk.createGame.phaseLengthUnitSelect.label);
    const { items } = picker.props;
    const labels = items.map((item: { label: string }) => item.label);
    expect(labels).toEqual([
      tk.durations.minute.singular,
      tk.durations.hour.singular,
      tk.durations.day.singular,
    ]);
  });
  test("phaseLengthUnit labels are plural if phaseLengthMultiplier is plural", () => {
    const { getByTestId } = arrange({ values: { phaseLengthMultiplier: 2 } });
    const picker = getByTestId(tk.createGame.phaseLengthUnitSelect.label);
    const { items } = picker.props;
    const labels = items.map((item: { label: string }) => item.label);
    expect(labels).toEqual([
      tk.durations.minute.plural,
      tk.durations.hour.plural,
      tk.durations.day.plural,
    ]);
  });
  test("Press customAdjustmentPhaseLengthCheckbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(
      tk.createGame.customAdjustmentPhaseLengthCheckbox.label
    );
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith(
      "customAdjustmentPhaseLength",
      true
    );
  });
  test("adjustmentPhaseLengthMultiplierInput does not appear if not customAdjustmentPhaseLength", () => {
    const { queryByLabelText } = arrange();
    const input = queryByLabelText(
      tk.createGame.adjustmentPhaseLengthMultiplierInput.label
    );
    expect(input).toBe(null);
  });
  test("adjustmentPhaseLengthMultiplierInput appears if customAdjustmentPhaseLength", () => {
    const { getByLabelText } = arrange({
      values: { customAdjustmentPhaseLength: true },
    });
    getByLabelText(tk.createGame.adjustmentPhaseLengthMultiplierInput.label);
  });
  test("adjustmentPhaseLengthUnitSelect does not appear if not customAdjustmentPhaseLength", () => {
    const { getByTestId } = arrange({
      values: { customAdjustmentPhaseLength: true },
    });
    getByTestId(tk.createGame.adjustmentPhaseLengthUnitSelect.label);
  });
  test("adjustmentPhaseLengthUnitSelect appears if customAdjustmentPhaseLength", () => {
    const { queryByTestId } = arrange();
    const picker = queryByTestId(
      tk.createGame.adjustmentPhaseLengthUnitSelect.label
    );
    expect(picker).toBe(null);
  });
  test("Change adjustmentPhaseLengthMultiplierInput calls handleChange", () => {
    const { getByLabelText } = arrange({
      values: { customAdjustmentPhaseLength: true },
    });
    const input = getByLabelText(
      tk.createGame.adjustmentPhaseLengthMultiplierInput.label
    );
    fireEvent.changeText(input, "3");
    expect(mockHandleChange).toBeCalledWith("3");
  });
  test("Change adjustmentPhaseLengthUnitSelect calls setFieldValue", () => {
    const { getByTestId } = arrange({
      values: { customAdjustmentPhaseLength: true },
    });
    const picker = getByTestId(
      tk.createGame.adjustmentPhaseLengthUnitSelect.label
    );
    fireEvent(picker, "onValueChange", 1);
    expect(mockSetFieldValue).lastCalledWith("adjustmentPhaseLengthUnit", 1);
  });
  test("adjustmentPhaseLengthUnit labels are singular if adjustmentPhaseLengthUnit is singular", () => {
    const { getByTestId } = arrange({
      values: { customAdjustmentPhaseLength: true },
    });
    const picker = getByTestId(
      tk.createGame.adjustmentPhaseLengthUnitSelect.label
    );
    const { items } = picker.props;
    const labels = items.map((item: { label: string }) => item.label);
    expect(labels).toEqual([
      tk.durations.minute.singular,
      tk.durations.hour.singular,
      tk.durations.day.singular,
    ]);
  });
  test("adjustmentPhaseLengthUnit labels are plural if adjustmentPhaseLengthUnit is plural", () => {
    const { getByTestId } = arrange({
      values: {
        customAdjustmentPhaseLength: true,
        adjustmentPhaseLengthMultiplier: 2,
      },
    });
    const picker = getByTestId(
      tk.createGame.adjustmentPhaseLengthUnitSelect.label
    );
    const { items } = picker.props;
    const labels = items.map((item: { label: string }) => item.label);
    expect(labels).toEqual([
      tk.durations.minute.plural,
      tk.durations.hour.plural,
      tk.durations.day.plural,
    ]);
  });
  test("Press skipGetReadyPhase checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(
      tk.createGame.skipGetReadyPhaseCheckbox.label
    );
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("skipGetReadyPhase", false);
  });
  test("Press endAfterYears checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(tk.createGame.endAfterYearsCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("endAfterYears", true);
  });
  test("endAfterYearsInput hidden if not endAfterYears", () => {
    const { queryByLabelText } = arrange();
    const input = queryByLabelText(tk.createGame.endAfterYearsInput.label);
    expect(input).toBe(null);
  });
  test("endAfterYearsInput appears if endAfterYears", () => {
    const { getByLabelText } = arrange({ values: { endAfterYears: true } });
    getByLabelText(tk.createGame.endAfterYearsInput.label);
  });
  test("Change endAfterYears calls handleChange", () => {
    const { getByLabelText } = arrange({ values: { endAfterYears: true } });
    const input = getByLabelText(tk.createGame.endAfterYearsInput.label);
    fireEvent.changeText(input, "1910");
    expect(mockHandleChange).toBeCalledWith("1910");
  });
  test("Press conferenceChatEnabled checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(tk.createGame.conferenceChatCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("conferenceChatEnabled", false);
  });
  test("Press groupChatEnabled checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(tk.createGame.groupChatCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("groupChatEnabled", false);
  });
  test("Press individualChatEnabled checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(tk.createGame.individualChatCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("individualChatEnabled", false);
  });
  test("anonymousChatEnabled disabled if not private", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(tk.createGame.anonymousChatCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).not.toBeCalled();
  });
  test("Press anonymousChatEnabled checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange({ values: { privateGame: true } });
    const checkbox = getByLabelText(tk.createGame.anonymousChatCheckbox.label);
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("anonymousEnabled", true);
  });
  test("Shows anonymous helper message when not private", () => {
    const { getByText } = arrange();
    getByText(tk.createGame.anonymousChatCheckbox.explanation);
  });
  test("Does not show anonymous helper message when private", () => {
    const { queryByText } = arrange({ values: { privateGame: true } });
    const message = queryByText(
      tk.createGame.anonymousChatCheckbox.explanation
    );
    expect(message).toBe(null);
  });
  test("Change chatLanguage calls setFieldValue", () => {
    const { getByTestId } = arrange();
    const picker = getByTestId(tk.createGame.chatLanguageSelect.label);
    fireEvent(picker, "onValueChange", "en");
    expect(mockSetFieldValue).lastCalledWith("chatLanguage", "en");
  });
  test("Press reliabilityEnabled checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(
      tk.createGame.reliabilityEnabledCheckbox.label
    );
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("reliabilityEnabled", false);
  });
  test("minReliability error appears if error", () => {
    const { getByText } = arrange({
      validationErrors: { minReliability: "minReliabilityError" },
    });
    getByText("minReliabilityError");
  });
  test("minReliability input appears when reliabilityEnabled", () => {
    const { getByLabelText } = arrange();
    getByLabelText(tk.createGame.minReliabilityInput.label);
  });
  test("minReliability input hidden when not reliabilityEnabled", () => {
    const { queryByLabelText } = arrange({
      values: { reliabilityEnabled: false },
    });
    const input = queryByLabelText(tk.createGame.minReliabilityInput.label);
    expect(input).toBe(null);
  });
  test("Press quicknessEnabled checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(
      tk.createGame.quicknessEnabledCheckbox.label
    );
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("quicknessEnabled", false);
  });
  test("minQuickness error appears if error", () => {
    const { getByText } = arrange({
      validationErrors: { minQuickness: "minQuicknessError" },
    });
    getByText("minQuicknessError");
  });
  test("minQuickness input appears when quicknessEnabled", () => {
    const { getByLabelText } = arrange();
    getByLabelText(tk.createGame.minQuicknessInput.label);
  });
  test("minQuickness input hidden when not quicknessEnabled", () => {
    const { queryByLabelText } = arrange({
      values: { quicknessEnabled: false },
    });
    const input = queryByLabelText(tk.createGame.minQuicknessInput.label);
    expect(input).toBe(null);
  });
  test("Press minRatingEnabled checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(
      tk.createGame.minRatingEnabledCheckbox.label
    );
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("minRatingEnabled", true);
  });
  test("minRating error appears if error", () => {
    const { getByText } = arrange({
      values: { minRatingEnabled: true },
      validationErrors: { minRating: "minRatingError" },
    });
    getByText("minRatingError");
  });
  test("minRating input appears when ratingEnabled", () => {
    const { getByLabelText } = arrange({
      values: { minRatingEnabled: true },
    });
    getByLabelText(tk.createGame.minRatingInput.label);
  });
  test("minPercentage hidden when not ratingEnabled", () => {
    const { queryByText } = arrange();
    const helpText = queryByText(tk.createGame.minRatingInput.helpText);
    expect(helpText).toBe(null);
  });
  test("minPercentage appears appears when ratingEnabled", () => {
    const { getByText } = arrange({
      values: { minRatingEnabled: true },
    });
    getByText(tk.createGame.minRatingInput.helpText);
  });
  test("minRating input hidden when not ratingEnabled", () => {
    const { queryByLabelText } = arrange();
    const input = queryByLabelText(tk.createGame.minRatingInput.label);
    expect(input).toBe(null);
  });
  test("Press maxRatingEnabled checkbox calls setFieldValue", () => {
    const { getByLabelText } = arrange();
    const checkbox = getByLabelText(
      tk.createGame.maxRatingEnabledCheckbox.label
    );
    fireEvent.press(checkbox);
    expect(mockSetFieldValue).toBeCalledWith("maxRatingEnabled", true);
  });
  test("maxRating error appears if error", () => {
    const { getByText } = arrange({
      values: { maxRatingEnabled: true },
      validationErrors: { maxRating: "maxRatingError" },
    });
    getByText("maxRatingError");
  });
  test("maxRating input appears when ratingEnabled", () => {
    const { getByLabelText } = arrange({
      values: { maxRatingEnabled: true },
    });
    getByLabelText(tk.createGame.maxRatingInput.label);
  });
  test("maxPercentage appears appears when ratingEnabled", () => {
    const { getByText } = arrange({
      values: { maxRatingEnabled: true },
    });
    getByText(tk.createGame.maxRatingInput.helpText);
  });
  test("maxPercentage hidden when not ratingEnabled", () => {
    const { queryByText } = arrange();
    const helpText = queryByText(tk.createGame.maxRatingInput.helpText);
    expect(helpText).toBe(null);
  });
  test("maxRating input hidden when not ratingEnabled", () => {
    const { queryByLabelText } = arrange();
    const input = queryByLabelText(tk.createGame.maxRatingInput.label);
    expect(input).toBe(null);
  });
  test("maxRating float works correctly", () => {
    const { getByLabelText } = arrange({
      values: { maxRatingEnabled: true, maxRating: 10.5 },
    });
    const input = getByLabelText(tk.createGame.maxRatingInput.label);
    expect(input.props.value).toBe("10");
  });
  test("change maxRating calls setFieldValue with number", () => {
    const { getByLabelText } = arrange({
      values: { maxRatingEnabled: true },
    });
    const input = getByLabelText(tk.createGame.maxRatingInput.label);
    fireEvent.changeText(input, "11");
    expect(mockSetFieldValue).toBeCalledWith("maxRating", 11);
  });
  test("Press submit button calls submitForm", () => {
    const { getByLabelText } = arrange();
    const button = getByLabelText(tk.createGame.submitButton.label);
    fireEvent.press(button);
    expect(mockSubmitForm).toBeCalled();
  });
  test("Press submit button does not call submitForm if disabled", () => {
    const { getByLabelText } = arrange({ submitDisabled: true });
    const button = getByLabelText(tk.createGame.submitButton.label);
    fireEvent.press(button);
    expect(mockSubmitForm).not.toBeCalled();
  });
});
