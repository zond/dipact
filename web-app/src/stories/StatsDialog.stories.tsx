import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/StatsDialog";
import { routerDecorator } from "./decorators";

import { IUseStatsDialog, statsDialogDecorator } from "../hooks/useStatsDialog";

export default {
  title: "components/StatsDialog",
  component: Component,
  //   decorators: [routerDecorator()],
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => <Component />;

const defaultUseStatsDialogValues: IUseStatsDialog = {
  abandonedGames: 1,
  banIsLoading: false,
  draws: 2,
  eliminations: 3,
  error: null,
  finishedGames: 4,
  hated: 5,
  hater: 6,
  isBanned: false,
  isCurrentUser: false,
  isError: false,
  isLoading: false,
  isMuted: false,
  joinedGames: 7,
  nation: undefined,
  quickness: 3,
  ranking: 10,
  rating: 11,
  ratingPercentile: 88,
  reliability: 4,
  showIsMuted: false,
  soloWins: 2,
  startedGames: 3,
  toggleBanned: () => {},
  toggleMuted: () => {},
  username: "Johnpooch",
};

export const Default = Template.bind({});
Default.decorators = [
  routerDecorator("/?user-stats=123"),
  statsDialogDecorator(defaultUseStatsDialogValues),
];

export const Closed = Template.bind({});
Closed.decorators = [
  routerDecorator(""),
  statsDialogDecorator(defaultUseStatsDialogValues),
];

export const IsLoading = Template.bind({});
IsLoading.decorators = [
  routerDecorator("/?user-stats=123"),
  statsDialogDecorator({ ...defaultUseStatsDialogValues, isLoading: true }),
];

export const IsError = Template.bind({});
IsError.decorators = [
  routerDecorator("/?user-stats=123"),
  statsDialogDecorator({
    ...defaultUseStatsDialogValues,
    isError: true,
    error: {},
  }),
];

export const ShowIsMuted = Template.bind({});
ShowIsMuted.decorators = [
  routerDecorator("/?user-stats=123"),
  statsDialogDecorator({
    ...defaultUseStatsDialogValues,
    showIsMuted: true,
  }),
]

export const IsMuted = Template.bind({});
IsMuted.decorators = [
  routerDecorator("/?user-stats=123"),
  statsDialogDecorator({
    ...defaultUseStatsDialogValues,
    showIsMuted: true,
    isMuted: true,
  }),
]

export const IsBanned = Template.bind({});
IsBanned.decorators = [
  routerDecorator("/?user-stats=123"),
  statsDialogDecorator({
    ...defaultUseStatsDialogValues,
    isBanned: true,
  }),
];

export const BanIsLoading = Template.bind({});
BanIsLoading.decorators = [
  routerDecorator("/?user-stats=123"),
  statsDialogDecorator({
    ...defaultUseStatsDialogValues,
    banIsLoading: true,
  }),
];

export const IsNation = Template.bind({});
IsNation.decorators = [
  routerDecorator("/?user-stats=123:456"),
  statsDialogDecorator({
    ...defaultUseStatsDialogValues,
    showIsMuted: true,
    nation: "England",
  }),
];

export const IsCurrentUser = Template.bind({});
IsCurrentUser.decorators = [
  routerDecorator("/?user-stats=123:456"),
  statsDialogDecorator({
    ...defaultUseStatsDialogValues,
    showIsMuted: true,
    nation: "England",
    isCurrentUser: true,
  }),
];
