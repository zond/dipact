import { NationAllocation } from "@diplicity/common";
import { Divider } from "@rneui/base";
import React from "react";
import { View } from "react-native";
import { GameCardSkeleton } from "../components/GameCard";
import GameCard from "../components/GameCard/GameCard";
import { GameDisplay } from "../components/GameCard/types";
import PlayerCard from "../components/PlayerCard";

const players: { [key: string]: GameDisplay["players"][0] } = {
  johnpooch: {
    username: "johnpooch",
    image:
      "https://lh3.googleusercontent.com/a/AEdFTp5NmTUfDOiREYyBdkvptwCxs003VjNpqDpB2kHl=s96-c",
  },
  joren: {
    username: "joren",
    image:
      "https://lh3.googleusercontent.com/a/AEdFTp5Uz8Syu_d064B_2CdLy7aYcjXPJZ2la_3ScPe-=s96-c",
  },
};

const commonProps = {
  chatDisabled: false,
  chatLanguage: "en",
  chatLanguageDisplay: "English",
  createdAtDisplay: "01/03/2022",
  deadlineDisplay: "< 1hr",
  failedRequirements: [],
  gameVariant: "Classical",
  id: "1",
  minQuickness: null,
  minRating: null,
  minReliability: null,
  name: "Basic game",
  nationAllocation: NationAllocation.Random,
  numUnreadMessages: 1,
  phaseSummary: "Fall 1910, Adjustment",
  players: [players.johnpooch, players.joren],
  privateGame: false,
  rulesSummary: "Classical 2d",
  started: true,
  userIsMember: true,
  userIsGameMaster: false,
  variantNumNations: 7,
  confirmationStatus: undefined,
  status: "Active",
};

const playerProps = {
  variant: "expanded",
  username: "johnpooch",
  src: "https://lh3.googleusercontent.com/a/AEdFTp5Uz8Syu_d064B_2CdLy7aYcjXPJZ2la_3ScPe-=s96-c",
  reliabilityLabel: "commited",
  reliabilityRating: 1,
  numPlayedGames: 1,
  numWonGames: 1,
  numDrawnGames: 1,
  numAbandonnedGames: 1,
} as const;

const games: GameDisplay[] = [
  // { ...commonProps, name: "Active Confirmed", confirmationStatus: "Confirmed" },
  // { ...commonProps, name: "Active Not Confirmed", confirmationStatus: "NotConfirmed" },
  // { ...commonProps, name: "Active NMR", confirmationStatus: "NMR" },
  // { ...commonProps, name: "Active Avatar Overflow", players: [players.joren, players.joren, players.joren, players.joren, players.joren, players.joren, players.joren, players.joren, players.joren, players.joren, players.joren, players.joren] },
  // { ...commonProps, name: "Staging Game User Not Participant", status: "Staging" },
  {
    ...commonProps,
    name: "Staging Private Game User Not Participant",
    status: "Staging",
    privateGame: true,
  },
  {
    ...commonProps,
    name: "Rules",
    status: "Staging",
    privateGame: true,
    nationAllocation: NationAllocation.Preference,
  },
  {
    ...commonProps,
    name: "Chat disabled",
    status: "Staging",
    privateGame: true,
    nationAllocation: NationAllocation.Preference,
    chatDisabled: true,
  },
];

const BrowseGames = () => {
  return (
    <View>
      <PlayerCard {...playerProps} />
      {games.map((game) => (
        <View key={game.id}>
          <GameCard game={game} />
          <Divider />
        </View>
      ))}
      <Divider />
      <GameCardSkeleton />
    </View>
  );
};

export default BrowseGames;
