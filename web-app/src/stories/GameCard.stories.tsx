import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/GameCard";
import { NationAllocation } from "@diplicity/common";
import { routerDecorator } from "./decorators";
import { gameCardDecorator } from "../hooks/useGameCard";
import { Container } from "@mui/material";

export default {
  title: "components/GameCard",
  component: Component,
  decorators: [routerDecorator()],
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Container>
    <Component {...args} />
  </Container>
);

const defaultGame = {
  chatDisabled: false,
  chatLanguage: "en",
  chatLanguageDisplay: "English",
  createdAtDisplay: "09/09/2021",
  deadlineDisplay: "<2d",
  failedRequirements: [],
  gameVariant: "Classical",
  id: "123",
  minQuickness: 10,
  minRating: 5,
  minReliability: 4,
  name: "Game name",
  nationAllocation: NationAllocation.Random,
  numUnreadMessages: 0,
  phaseSummary: "Spring 1901 Movement",
  privateGame: false,
  players: [{ username: "johnpooch", image: "" }],
  rulesSummary: "Classical 2d",
  started: true,
  userIsMember: false,
  userIsGameMaster: false,
  variantNumNations: 7,
};

const defaultUseGameCardValues = {
  deleteGame: () => {
    return;
  },
  joinGame: () => {
    return;
  },
  onClickInvite: () => {
    return;
  },
  isLoading: false,
};

export const Started = Template.bind({});
Started.args = {
  game: { ...defaultGame },
};
Started.decorators = [
  gameCardDecorator({
    ...defaultUseGameCardValues,
  }),
];

export const Open = Template.bind({});
Open.args = {
  game: { ...defaultGame, started: false },
};
Open.decorators = [
  gameCardDecorator({
    ...defaultUseGameCardValues,
  }),
];
