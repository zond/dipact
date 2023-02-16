import { Game as StoreGame, User, GameDisplay } from "../store/types";
import {
  getPhaseDisplay,
  nationAllocationMap,
  phaseLengthDisplay,
  timeStrToDate,
} from "../utils/general";
import isoCodes from "../utils/isoCodes";

// TODO test
export const transformGame = (game: StoreGame, user: User): GameDisplay => {
  const userIsGameMaster = game.GameMaster.Id === user.Id;
  const userIsMember = Boolean(
    game.Members.find((member) => member.User.Id === user.Id)
  );
  const status = game.Finished
    ? "finished"
    : game.Started
    ? "started"
    : "staging";

  return {
    chatDisabled: game.DisablePrivateChat,
    chatLanguage: game.ChatLanguageISO639_1,
    chatLanguageDisplay:
      isoCodes.find((code) => code.code === game.ChatLanguageISO639_1)?.name ||
      "",
    confirmationStatus: "notConfirmed",
    createdAtDisplay: timeStrToDate(game.CreatedAt),
    deadlineDisplay: phaseLengthDisplay(game),
    failedRequirements: game.FailedRequirements || [],
    gameVariant: game.Variant,
    id: game.ID,
    minQuickness: game.MinQuickness,
    minRating: game.MinRating,
    minReliability: game.MinReliability,
    name: game.Desc,
    nationAllocation: nationAllocationMap[game.NationAllocation],
    numUnreadMessages: 0,
    phaseSummary: getPhaseDisplay(game),
    players: game.Members.map((member) => ({
      username: member.User.Name as string,
      image: member.User.Picture as string,
    })),
    privateGame: game.Private,
    rulesSummary: game.Variant + " " + phaseLengthDisplay(game),
    status,
    userIsMember,
    userIsGameMaster,
    variantNumNations: 9,
  };
};
