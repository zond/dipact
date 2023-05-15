import { getLanguage } from "../../../utils";
import { Member } from "../../types";
import {
  CreateGameFormValues,
  DiplicityApiGame,
  DiplicityApiMember,
  DiplicityApiNewGame,
  Game,
  Player,
} from "./types";

export const transformCreateGameFormValuesToNewGame = (
  values: CreateGameFormValues
): DiplicityApiNewGame => {
  return {
    Anonymous: values.anonymousEnabled,
    ChatLanguageISO639_1: values.chatLanguage,
    Desc: values.name,
    DisableConferenceChat: !values.conferenceChatEnabled,
    DisableGroupChat: !values.groupChatEnabled,
    DisablePrivateChat: !values.individualChatEnabled,
    FirstMember: { NationPreferences: "" },
    GameMasterEnabled: values.gameMaster,
    LastYear: values.endAfterYears ? values.endAfterYearsValue : 0,
    MaxHated: 0,
    MaxHater: 0,
    MaxRating: values.maxRatingEnabled ? values.maxRating : 0,
    MinQuickness: values.minQuickness,
    MinRating: values.minRating,
    MinReliability: values.minReliability,
    NationAllocation: values.nationAllocation === "random" ? 0 : 1,
    NonMovementPhaseLengthMinutes: values.customAdjustmentPhaseLength
      ? values.adjustmentPhaseLengthMultiplier *
        values.adjustmentPhaseLengthUnit
      : 0,
    PhaseLengthMinutes: values.phaseLengthMultiplier * values.phaseLengthUnit,
    Private: values.privateGame,
    RequireGameMasterInvitation: values.requireGameMasterInvitation,
    SkipMuster: true,
    Variant: values.variant,
  };
};

export const transformMemberToPlayer = (
  member: DiplicityApiMember
): Player => ({
  id: member.User.Id,
  username: member.User.Name,
  src: member.User.Picture,
  nation: member.Nation,
});

export const transformGame = (game: DiplicityApiGame): Game => ({
  anonymous: game.Anonymous,
  chatDisabled: game.DisableConferenceChat && game.DisableGroupChat && game.DisablePrivateChat,
  chatLanguage: game.ChatLanguageISO639_1,
  chatLanguageDisplay: getLanguage(game.ChatLanguageISO639_1)?.name || "English";,
  closed: game.Closed,
  confirmationStatus: "notConfirmed",
  conferenceChatEnabled: !game.DisableConferenceChat,
  createdAt: new Date(Date.parse(game.CreatedAt)).toLocaleDateString(),
  deadline: phaseLengthDisplay(game),
  endYear: game.LastYear,
  finished: game.Finished,
  finishedAt: new Date(Date.parse(game.FinishedAt)).toLocaleDateString(),
  gameMaster: this.getGameMaster(),
  groupChatEnabled: !game.DisableGroupChat,
  id: game.ID,
  name: game.Desc,
  nationAllocation: getNationAllocation(game.NationAllocation),
  newestPhaseMeta: game.NewestPhaseMeta,
  nonMovementPhaseLength: convertMinutesToLabel(
    game.NonMovementPhaseLengthMinutes
  ),
  numPlayers: game.NMembers,
  phaseLength: convertMinutesToLabel(game.PhaseLengthMinutes),
  phaseSummary: getPhaseDisplay(game),
  players: this.getPlayers(),
  playerIdentity: game.Anonymous ? "anonymous" : "public",
  privateChatEnabled: !game.DisablePrivateChat,
  privateGame: game.Private,
  rulesSummary: game.Variant + " " + phaseLengthDisplay(game),
  started: game.Started,
  startedAt: this.asDate(game.StartedAt),
  status: game.Finished ? "finished" : game.Started ? "started" : "staging",
  userIsPlayer: (user) =>
    Boolean(this.getPlayers().find((player) => player.id === user.id)),
  userIsGameMaster: (user) => this.getGameMaster()?.id === user.id,
  variant: game.Variant,
  visibility: game.Private ? "private" : "public",
});
