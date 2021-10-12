import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/PhaseSelector";

export default {
  title: "components/PhaseSelector",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Default = Template.bind({});
Default.args = {
    selectedPhase: 5,
    phases: [
        [1, "Spring 1901, Movement"],
        [2, "Spring 1901, Retreat"],
        [3, "Fall 1901, Movement"],
        [4, "Fall 1901, Retreat"],
        [5, "Fall 1901, Adjustment"],
    ],
    onSelectPhase: console.log,
};

