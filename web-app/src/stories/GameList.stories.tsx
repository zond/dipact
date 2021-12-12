import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../pages/GameList";
import { routerDecorator } from "./decorators";
import { generatePath } from "react-router";
import { RouteConfig } from "../pages/RouteConfig";

export default {
  title: "pages/GameList",
  component: Component,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => (
  <Component />
);

export const Default = Template.bind({});
Default.args = {};
Default.decorators = [
  routerDecorator(generatePath(RouteConfig.GameList), RouteConfig.GameList),
];
