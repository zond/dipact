import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component, { withMuted } from "../components/NationAvatar";
import NationAvatar from "../components/NationAvatar";

export default {
  title: "components/NationAvatar",
  component: Component,
  argTypes: { onClick: { action: 'clicked' } },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

type Args = Omit<React.ComponentProps<typeof NationAvatar>, "onClick">;

const defaultArgs: Args = {
  nation: "France",
  nationAbbreviation: "Fra",
  color: "#f8c1ff",
};

export const France = Template.bind({});
France.args = {
  ...defaultArgs,
  link: "https://diplicity-engine.appspot.com/Variant/Classical/Flags/France.svg",
  nation: "France",
  nationAbbreviation: "Fra",
};

export const Russia = Template.bind({});
Russia.args = {
  ...defaultArgs,
  link: "https://diplicity-engine.appspot.com/Variant/Classical/Flags/Russia.svg",
};

export const Germany = Template.bind({});
Germany.args = {
  ...defaultArgs,
  link: "https://diplicity-engine.appspot.com/Variant/Classical/Flags/Germany.svg",
};

export const England = Template.bind({});
England.args = {
  ...defaultArgs,
  link: "https://diplicity-engine.appspot.com/Variant/Classical/Flags/England.svg",
};

export const Turkey = Template.bind({});
Turkey.args = {
  ...defaultArgs,
  link: "https://diplicity-engine.appspot.com/Variant/Classical/Flags/Turkey.svg",
};

export const NoLinkLongAbbreviation = Template.bind({});
NoLinkLongAbbreviation.args = {
  ...defaultArgs,
  nationAbbreviation: "Russ",
};

export const NoLinkShortAbbreviation = Template.bind({});
NoLinkShortAbbreviation.args = {
  ...defaultArgs,
};

export const NoLinkDarkColor = Template.bind({});
NoLinkDarkColor.args = {
  ...defaultArgs,
  color: "#9d00b1",
};

export const Otto = Template.bind({});
Otto.args = {
  ...defaultArgs,
  link: "https://diplicity-engine.appspot.com/img/otto.png",
  nation: "Diplicity",
  nationAbbreviation: "",
  color: "#FFFFFF"
};

const WithMutedTemplate: ComponentStory<typeof Component> = (args) => {
  const avatar = <Component {...args} />;
  return withMuted(avatar);
}

export const Muted = WithMutedTemplate.bind({});
Muted.args = {
  ...defaultArgs,
};