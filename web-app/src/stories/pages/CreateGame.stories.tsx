import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../../pages/CreateGame";
import { routerDecorator } from "../decorators";
import { Container } from "@mui/material";

import tk from "../../translations/translateKeys";

import {
  initialFormValues,
  IUseCreateGame,
  createGameDecorator,
} from "../../hooks/useCreateGame";
import { Variant } from "../../store/types";

export default {
  title: "pages/CreateGame",
  component: Component,
  decorators: [routerDecorator()],
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => (
  <Container>
    <Component />
  </Container>
);

const defaultVariant: Partial<Variant> = {
  CreatedBy: "Johnpooch",
  Description: "Variant description",
  Name: "Classical",
  Nations: [],
  Rules: "These are the rules of the variant",
  Start: {
    Year: 1901,
  } as Variant["Start"],
};

const defaultFormValues = { ...initialFormValues, name: "Game name" };

const defaultUseCreateGameValues: IUseCreateGame = {
  handleChange: () => {},
  handleSubmit: () => {},
  isLoading: false,
  isFetchingVariantSVG: false,
  randomizeName: () => {},
  selectedVariant: defaultVariant as Variant,
  selectedVariantSVG: "",
  submitDisabled: false,
  userStats: undefined,
  values: { ...initialFormValues, name: "Game name" },
  variants: [defaultVariant as Variant],
  validationErrors: {},
};

export const Default = Template.bind({});
Default.decorators = [createGameDecorator(defaultUseCreateGameValues)];

export const IsLoading = Template.bind({});
IsLoading.decorators = [
  createGameDecorator({ ...defaultUseCreateGameValues, isLoading: true }),
];

export const IsFetchingVariantSVG = Template.bind({});
IsFetchingVariantSVG.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    isFetchingVariantSVG: true,
  }),
];

export const PrivateGameChecked = Template.bind({});
PrivateGameChecked.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, privateGame: true },
  }),
];

export const MinRatingChecked = Template.bind({});
MinRatingChecked.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, minRatingEnabled: true },
  }),
];

export const MaxRatingChecked = Template.bind({});
MaxRatingChecked.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, maxRatingEnabled: true },
  }),
];

export const ReliabilityUnchecked = Template.bind({});
ReliabilityUnchecked.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, reliabilityEnabled: false },
  }),
];

export const QuicknessUnchecked = Template.bind({});
QuicknessUnchecked.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, quicknessEnabled: false },
  }),
];

export const ShorterAdjustmentPhasesChecked = Template.bind({});
ShorterAdjustmentPhasesChecked.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, customAdjustmentPhaseLength: true },
  }),
];

export const EndAfterYearsChecked = Template.bind({});
EndAfterYearsChecked.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, endAfterYears: true },
  }),
];

export const SubmitButtonDisabled = Template.bind({});
SubmitButtonDisabled.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    submitDisabled: true
  }),
];

export const ValidationErrorMaxRating = Template.bind({});
ValidationErrorMaxRating.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, maxRatingEnabled: true },
    validationErrors: {
      maxRating: tk.createGame.maxRatingInput.errorMessage.lessThanUserRating
    }
  }),
];

export const ValidationErrorMinRating = Template.bind({});
ValidationErrorMinRating.decorators = [
  createGameDecorator({
    ...defaultUseCreateGameValues,
    values: { ...defaultFormValues, minRatingEnabled: true },
    validationErrors: {
      minRating: tk.createGame.minRatingInput.errorMessage.moreThanUserRating
    }
  }),
];
