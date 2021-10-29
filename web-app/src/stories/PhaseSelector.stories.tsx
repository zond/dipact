import React from "react";
import { ComponentStory, Meta } from "@storybook/react";

import Component from "../components/PhaseSelector";

export default {
  title: "components/PhaseSelector",
  component: Component,
} as Meta;

const Template: ComponentStory<typeof Component> = () => (
  <Component />
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
    onSelectPhase: () => { return },
};

