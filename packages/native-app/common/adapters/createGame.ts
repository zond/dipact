import { CreateGameFormValues, NewGame } from "../store";
import { Adapter } from "./types";

class CreateGameAdapter
  extends Adapter<CreateGameFormValues>
  implements NewGame
{
  get Anonymous() {
    return this.adaptee.anonymousEnabled;
  }
  get ChatLanguageISO639_1() {
    return this.adaptee.chatLanguage;
  }
  get Desc() {
    return this.adaptee.name;
  }
  get DisableConferenceChat() {
    return !this.adaptee.conferenceChatEnabled;
  }
  get DisableGroupChat() {
    return !this.adaptee.groupChatEnabled;
  }
  get DisablePrivateChat() {
    return !this.adaptee.individualChatEnabled;
  }
  get FirstMember() {
    return { NationPreferences: "" };
  }
  get GameMasterEnabled() {
    return this.adaptee.gameMaster;
  }
  get LastYear() {
    return this.adaptee.endAfterYears ? this.adaptee.endAfterYearsValue : 0;
  }
  get MaxHated() {
    return 0;
  }
  get MaxHater() {
    return 0;
  }
  get MaxRating() {
    return this.adaptee.maxRatingEnabled ? this.adaptee.maxRating : 0;
  }
  get MinQuickness() {
    return this.adaptee.minQuickness;
  }
  get MinRating() {
    return this.adaptee.minRating;
  }
  get MinReliability() {
    return this.adaptee.minReliability;
  }
  get NationAllocation() {
    return this.adaptee.nationAllocation === "random" ? 0 : 1;
  }
  get NonMovementPhaseLengthMinutes() {
    const adjustmentPhaseLengthMinutes = this.adaptee
      .customAdjustmentPhaseLength
      ? this.adaptee.adjustmentPhaseLengthMultiplier *
        this.adaptee.adjustmentPhaseLengthUnit
      : 0;
    return adjustmentPhaseLengthMinutes;
  }
  get PhaseLengthMinutes() {
    const phaseLengthMinutes =
      this.adaptee.phaseLengthMultiplier * this.adaptee.phaseLengthUnit;
    return phaseLengthMinutes;
  }
  get Private() {
    return this.adaptee.privateGame;
  }
  get RequireGameMasterInvitation() {
    return this.adaptee.requireGameMasterInvitation;
  }
  get SkipMuster() {
    return true;
  }
  get Variant() {
    return this.adaptee.variant;
  }
}

export const createGameAdapter = (values: CreateGameFormValues) =>
  new CreateGameAdapter(values);
