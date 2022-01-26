import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/GameCard";
import { NationAllocation } from "../hooks/useGameList";
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
  chatLanguage: "en-US",
  chatLanguageDisplay: "English",
  createdAtDisplay: "",
  deadlineDisplay: "",
  failedRequirements: [],
  gameVariant: "Classical",
  id: "123",
  minQuickness: null,
  minRating: null,
  minReliability: null,
  name: "Game name",
  nationAllocation: NationAllocation.Random,
  numUnreadMessages: 0,
  phaseSummary: "",
  privateGame: false,
  players: [],
  rulesSummary: "",
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

export const Default = Template.bind({});
Default.args = {
  game: { ...defaultGame },
};
Default.decorators = [
  gameCardDecorator({
    ...defaultUseGameCardValues,
  }),
];
