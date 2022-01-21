import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { generatePath } from "react-router";

import Component from "../components/GameNavBar";
import { routerDecorator } from "./decorators";
import theme from "../theme";
import { RouteConfig } from "../pages/RouteConfig";

export default {
  title: "components/GameNavBar",
  component: Component,
  decorators: [
    routerDecorator(generatePath(RouteConfig.Game, { gameId: "123" }), RouteConfig.Game),
  ],
} as ComponentMeta<typeof Component>;

interface WrapperComponentProps {
  children: React.ReactNode;
  width: string;
}

const WrapperComponent = ({ children, width }: WrapperComponentProps) => {
  return <div style={{ width }}>{children}</div>;
};

const XS: ComponentStory<typeof Component> = (args) => (
  <WrapperComponent width={"320px"}>
    <Component {...args} />
  </WrapperComponent>
);

const SM: ComponentStory<typeof Component> = (args) => (
  <WrapperComponent width={`${theme.breakpoints.values["sm"]}px`}>
    <Component {...args} />
  </WrapperComponent>
);

const MD: ComponentStory<typeof Component> = (args) => (
  <WrapperComponent width={`${theme.breakpoints.values["md"]}px`}>
    <Component {...args} />
  </WrapperComponent>
);

const LG: ComponentStory<typeof Component> = (args) => (
  <WrapperComponent width={`${theme.breakpoints.values["lg"]}px`}>
    <Component {...args} />
  </WrapperComponent>
);

const XL: ComponentStory<typeof Component> = (args) => (
  <WrapperComponent width={`${theme.breakpoints.values["xl"]}px`}>
    <Component {...args} />
  </WrapperComponent>
);

const children = <div></div>;

export const ExtraSmall = XS.bind({});
XS.args = {
  children,
};

export const Small = SM.bind({});
SM.args = {
  children,
};

export const Medium = MD.bind({});
MD.args = {
  children,
};

export const Large = LG.bind({});
LG.args = {
  children,
};

export const ExtraLarge = XL.bind({});
XL.args = {
  children,
};
