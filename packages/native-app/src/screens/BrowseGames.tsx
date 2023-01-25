import { GameDisplay as GameDisplay, NationAllocation } from "@diplicity/common";
import { Divider } from "@rneui/base";
import React from "react";
import { Text, View } from "react-native";
import { GameCardSkeleton } from "../components/GameCard";
import GameCard from "../components/GameCard/GameCard";

const players: { [key: string]: GameDisplay["players"][0] } = {
  johnpooch: {
    username: "johnpooch",
    image: "https://lh3.googleusercontent.com/a/AEdFTp5NmTUfDOiREYyBdkvptwCxs003VjNpqDpB2kHl=s96-c",
  },
  joren: {
    username: "joren",
    image: "https://lh3.googleusercontent.com/a/AEdFTp5Uz8Syu_d064B_2CdLy7aYcjXPJZ2la_3ScPe-=s96-c",
  },
}

const games: GameDisplay[] = [
  {
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
  }
]

const BrowseGames = () => {
  return (
    <View>
      <GameCardSkeleton />
      <Divider />
      {games.map((game) => (
        <View key={game.id}>
          <GameCard game={game} />
          <Divider />
        </View>
      ))}
    </View>
  );
};

export default BrowseGames;
