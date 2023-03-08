import {
  Game,
  TransformedGame,
  TransformedGamePlayer,
  TransformedUser,
} from "../store";
import {
  convertMinutesToLabel,
  getLanguage,
  getNationAllocation,
  getPhaseDisplay,
  phaseLengthDisplay,
  timeStrToDate,
} from "../utils/general";

class PlayerAdapter
  extends Adapter<Game["Members"][0]>
  implements TransformedGamePlayer
{
  get id() {
    return this.adaptee.User.Id;
  }
  get username() {
    return this.adaptee.User.Name;
  }
  get src() {
    return this.adaptee.User.Picture;
  }
  get nation() {
    return this.adaptee.Nation;
  }
}

class GameAdapter extends Adapter<Game> implements TransformedGame {
  get anonymous() {
    return this.adaptee.Anonymous;
  }
  get chatDisabled() {
    return (
      this.adaptee.DisableConferenceChat &&
      this.adaptee.DisableGroupChat &&
      this.adaptee.DisablePrivateChat
    );
  }
  get chatLanguage() {
    return this.adaptee.ChatLanguageISO639_1;
  }
  get chatLanguageDisplay() {
    return getLanguage(this.chatLanguage)?.name || "English";
  }
  get closed() {
    return this.adaptee.Closed;
  }
  get conferenceChatEnabled() {
    return !this.adaptee.DisableConferenceChat;
  }
  get confirmationStatus() {
    return "notConfirmed" as TransformedGame["confirmationStatus"];
  }
  get createdAt() {
    return timeStrToDate(this.adaptee.CreatedAt);
  }
  get deadline() {
    return phaseLengthDisplay(this.adaptee);
  }
  get endYear() {
    return this.adaptee.LastYear;
  }
  get finished() {
    return this.adaptee.Finished;
  }
  get finishedAt() {
    return timeStrToDate(this.adaptee.FinishedAt);
  }
  get gameMaster() {
    return this.players.find(
      (player) => player.id === this.adaptee.GameMaster.Id
    );
  }
  get groupChatEnabled() {
    return !this.adaptee.DisableGroupChat;
  }
  get id() {
    return this.adaptee.ID;
  }
  get name() {
    return this.adaptee.Desc;
  }
  get nationAllocation() {
    return getNationAllocation(this.adaptee.NationAllocation);
  }
  get newestPhaseMeta() {
    return this.adaptee.NewestPhaseMeta;
  }
  get nonMovementPhaseLength() {
    return convertMinutesToLabel(this.adaptee.NonMovementPhaseLengthMinutes);
  }
  get numPlayers() {
    return this.adaptee.NMembers;
  }
  get phaseLength() {
    return convertMinutesToLabel(this.adaptee.PhaseLengthMinutes);
  }
  get phaseSummary() {
    return getPhaseDisplay(this.adaptee);
  }
  get playerIdentity() {
    return this.adaptee.Anonymous ? "anonymous" : "public";
  }
  get players() {
    return this.adaptee.Members.map((member) => new PlayerAdapter(member));
  }
  get privateChatEnabled() {
    return !this.adaptee.DisablePrivateChat;
  }
  get privateGame() {
    return this.adaptee.Private;
  }
  get rulesSummary() {
    return this.adaptee.Variant + " " + phaseLengthDisplay(this.adaptee);
  }
  get started() {
    return this.adaptee.Started;
  }
  get startedAt() {
    return timeStrToDate(this.adaptee.StartedAt);
  }
  get status() {
    return this.finished ? "finished" : this.started ? "started" : "staging";
  }
  userIsPlayer(user: TransformedUser) {
    return Boolean(this.players.find((player) => player.id === user.id));
  }
  userIsGameMaster(user: TransformedUser) {
    return this.gameMaster?.id === user.id;
  }
  get variant() {
    return this.adaptee.Variant;
  }
  get visibility() {
    return this.privateGame ? "private" : "public";
  }
}

export const gameAdapter = (game: Game) => new GameAdapter(game);
