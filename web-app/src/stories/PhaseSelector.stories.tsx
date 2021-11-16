import React from "react";
import { ComponentStory, Meta } from "@storybook/react";

import Component from "../components/PhaseSelector";
import { defaultUsePhaseSelectorArgs } from "./base";
import { phaseSelectorDecorator, routerDecorator } from "./decorators";

export default {
  title: "components/PhaseSelector",
  component: Component,
} as Meta;

const Template: ComponentStory<typeof Component> = () => {
  return <Component />;
};

export const LastTurn = Template.bind({});
LastTurn.args = {};
LastTurn.decorators = [
  phaseSelectorDecorator({ ...defaultUsePhaseSelectorArgs }),
  routerDecorator(),
];

export const FirstTurn = Template.bind({});
FirstTurn.args = {};
FirstTurn.decorators = [
  phaseSelectorDecorator({ ...defaultUsePhaseSelectorArgs, selectedPhase: 1 }),
  routerDecorator(),
];

export const MiddleTurn = Template.bind({});
MiddleTurn.args = {};
MiddleTurn.decorators = [
  phaseSelectorDecorator({ ...defaultUsePhaseSelectorArgs, selectedPhase: 2 }),
  routerDecorator(),
];

export const NoTurn = Template.bind({});
NoTurn.args = {};
NoTurn.decorators = [
  phaseSelectorDecorator({ ...defaultUsePhaseSelectorArgs, selectedPhase: undefined }),
  routerDecorator(),
];
