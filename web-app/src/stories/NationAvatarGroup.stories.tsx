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
const RussiaAvatarArgs = { ...AvatarStories.Russia.args, key: AvatarStories.Russia.args?.nation } as NationAvatarProps;
const FranceAvatarArgs = { ...AvatarStories.France.args, key: AvatarStories.France.args?.nation } as NationAvatarProps;
const GermanyAvatarArgs = { ...AvatarStories.Germany.args, key: AvatarStories.Germany.args?.nation } as NationAvatarProps;
const EnglandAvatarArgs = { ...AvatarStories.England.args, key: AvatarStories.England.args?.nation } as NationAvatarProps;
const TurkeyAvatarArgs = { ...AvatarStories.Turkey.args, key: AvatarStories.Turkey.args?.nation } as NationAvatarProps;

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
    <AvatarStories.France {...FranceAvatarArgs} key={"france2"} />,
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
    <AvatarStories.France {...FranceAvatarArgs} key={"france2"} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} key={"russia2"} />,
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
    <AvatarStories.France {...FranceAvatarArgs} key={"france2"} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} key={"russia2"} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} key={"germany2"} />,
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
    <AvatarStories.France {...FranceAvatarArgs} key={"france2"} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} key={"russia2"} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} key={"germany2"} />,
    <AvatarStories.England {...EnglandAvatarArgs} key={"england2"} />,
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
    <AvatarStories.France {...FranceAvatarArgs} key={"france2"} />,
    <AvatarStories.Russia {...RussiaAvatarArgs} key={"russia2"} />,
    <AvatarStories.Germany {...GermanyAvatarArgs} key={"germany2"} />,
    <AvatarStories.England {...EnglandAvatarArgs} key={"england2"} />,
    <AvatarStories.Turkey {...TurkeyAvatarArgs} key={"turkey2"} />,
  ],
};
