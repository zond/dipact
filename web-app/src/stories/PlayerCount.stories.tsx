import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/PlayerCount";

export default {
  title: "components/PlayerCount",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Default = Template.bind({});
Default.args = {
    numPlayers: 3,
    maxNumPlayers: 7,
}

export const Zero = Template.bind({});
Zero.args = {
    numPlayers: 0,
    maxNumPlayers: 7,
}
