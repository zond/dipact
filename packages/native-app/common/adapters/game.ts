import { Game, TransformedGame, TransformedGamePlayer } from "../store";
import {
  convertMinutesToLabel,
  getLanguage,
  getNationAllocation,
  getPhaseDisplay,
  phaseLengthDisplay,
} from "../utils/general";
import { Adapter } from "./adapter";

class PlayerAdapter extends Adapter<Game["Members"][0], TransformedGamePlayer> {
  adapt(): TransformedGamePlayer {
    return {
      id: this.adaptee.User.Id,
      username: this.adaptee.User.Name,
      src: this.adaptee.User.Picture,
      nation: this.adaptee.Nation,
    };
  }
}

class GameAdapter extends Adapter<Game, TransformedGame> {
  private getChatDisabled() {
    return (
      this.adaptee.DisableConferenceChat &&
      this.adaptee.DisableGroupChat &&
      this.adaptee.DisablePrivateChat
    );
  }

  private getChatLanguageDisplay() {
    return getLanguage(this.adaptee.ChatLanguageISO639_1)?.name || "English";
  }

  private getGameMaster() {
    return this.getPlayers().find(
      (player) => player.id === this.adaptee.GameMaster.Id
    );
  }

  private getPlayers() {
    return this.adaptee.Members.map((member) =>
      new PlayerAdapter(member).adapt()
    );
  }

  adapt(): TransformedGame {
    return {
      anonymous: this.adaptee.Anonymous,
      chatDisabled: this.getChatDisabled(),
      chatLanguage: this.adaptee.ChatLanguageISO639_1,
      chatLanguageDisplay: this.getChatLanguageDisplay(),
      closed: this.adaptee.Closed,
      confirmationStatus: "notConfirmed",
      conferenceChatEnabled: !this.adaptee.DisableConferenceChat,
      createdAt: this.asDate(this.adaptee.CreatedAt),
      deadline: phaseLengthDisplay(this.adaptee),
      endYear: this.adaptee.LastYear,
      finished: this.adaptee.Finished,
      finishedAt: this.asDate(this.adaptee.FinishedAt),
      gameMaster: this.getGameMaster(),
      groupChatEnabled: !this.adaptee.DisableGroupChat,
      id: this.adaptee.ID,
      name: this.adaptee.Desc,
      nationAllocation: getNationAllocation(this.adaptee.NationAllocation),
      newestPhaseMeta: this.adaptee.NewestPhaseMeta,
      nonMovementPhaseLength: convertMinutesToLabel(
        this.adaptee.NonMovementPhaseLengthMinutes
      ),
      numPlayers: this.adaptee.NMembers,
      phaseLength: convertMinutesToLabel(this.adaptee.PhaseLengthMinutes),
      phaseSummary: getPhaseDisplay(this.adaptee),
      players: this.getPlayers(),
      playerIdentity: this.adaptee.Anonymous ? "anonymous" : "public",
      privateChatEnabled: !this.adaptee.DisablePrivateChat,
      privateGame: this.adaptee.Private,
      rulesSummary:
        this.adaptee.Variant + " " + phaseLengthDisplay(this.adaptee),
      started: this.adaptee.Started,
      startedAt: this.asDate(this.adaptee.StartedAt),
      status: this.adaptee.Finished
        ? "finished"
        : this.adaptee.Started
        ? "started"
        : "staging",
      userIsPlayer: (user) =>
        Boolean(this.getPlayers().find((player) => player.id === user.id)),
      userIsGameMaster: (user) => this.getGameMaster()?.id === user.id,
      variant: this.adaptee.Variant,
      visibility: this.adaptee.Private ? "private" : "public",
    };
  }
}

export const gameAdapter = (game: Game) => new GameAdapter(game).adapt();
