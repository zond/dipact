import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import * as AvatarStories from "./NationAvatar.stories";
import NationAvatar from "../components/NationAvatar";
import Component from "../components/NationAvatarGroup";

export default {
  title: "components/NationAvatarGroup",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

type NationAvatarProps = React.ComponentProps<typeof NationAvatar>;
const RussiaAvatarArgs = AvatarStories.Russia.args as NationAvatarProps;
const FranceAvatarArgs = AvatarStories.France.args as NationAvatarProps;
const GermanyAvatarArgs = AvatarStories.Germany.args as NationAvatarProps;
const EnglandAvatarArgs = AvatarStories.England.args as NationAvatarProps;
const TurkeyAvatarArgs = AvatarStories.Turkey.args as NationAvatarProps;

export const OneAvatar = Template.bind({});
OneAvatar.args = {
  avatars: [<AvatarStories.France {...FranceAvatarArgs} />],
};

export const TwoAvatars = Template.bind({});
TwoAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
  ],
};

export const ThreeAvatars = Template.bind({});
ThreeAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
  ],
};

export const FourAvatars = Template.bind({});
FourAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
  ],
};

export const FiveAvatars = Template.bind({});
FiveAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
    <AvatarStories.Turkey {...TurkeyAvatarArgs} />,
  ],
};

export const SixAvatars = Template.bind({});
SixAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
    <AvatarStories.Turkey {...TurkeyAvatarArgs} />,
    <AvatarStories.France {...FranceAvatarArgs} />,
  ],
};

export const SevenAvatars = Template.bind({});
SevenAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
    <AvatarStories.Turkey {...TurkeyAvatarArgs} />,
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
  ],
};

export const EightAvatars = Template.bind({});
EightAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
    <AvatarStories.Turkey {...TurkeyAvatarArgs} />,
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
  ],
};

export const NineAvatars = Template.bind({});
NineAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
    <AvatarStories.Turkey {...TurkeyAvatarArgs} />,
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
  ],
};

export const TenAvatars = Template.bind({});
TenAvatars.args = {
  avatars: [
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
    <AvatarStories.Turkey {...TurkeyAvatarArgs} />,
    <AvatarStories.France {...FranceAvatarArgs} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} />,
    <AvatarStories.England {...EnglandAvatarArgs} />,
    <AvatarStories.Turkey {...TurkeyAvatarArgs} />,
  ],
};
